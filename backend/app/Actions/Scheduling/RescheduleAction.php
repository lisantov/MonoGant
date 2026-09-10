<?php

namespace App\Actions\Scheduling;

use App\Models\Sprint;
use App\Models\Task;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Lorisleiva\Actions\Concerns\AsAction;

/**
 * Перебалансирует расклад после привязки задачи или изменения ее дат.
 *
 * Связанные задачи (те, у которых есть next_task_id или предшественник) образуют сплошную
 * цепочку Ганта без зазоров: каждый преемник начинается ровно с дедлайна предшественника
 * (перекрытие сдвигается вперёд, ручной гэп стягивается назад), длительность задачи сохраняется.
 * Спринт рассматривается как блок: его рамка охватывает ВСЕ задачи спринта. Когда конец блока
 * переходит в следующий спринт, весь следующий блок сдвигается на минимальную величину (zero-gap),
 * чтобы ни одна задача не вылезала за рамки своего спринта.
 */
class RescheduleAction
{
    use AsAction;

    public function handle(Task $anchor): void
    {
        DB::transaction(function () use ($anchor): void {
            $clamped = $this->clampToPredecessor($anchor);
            $pushed = $this->pushTaskChain($anchor);

            if ($clamped || $pushed) {
                $this->rebalanceSprintChain($anchor->sprint);
            }
        });
    }

    private function clampToPredecessor(Task $anchor): bool
    {
        $predecessor = Task::where('next_task_id', $anchor->id)
            ->where('sprint_id', $anchor->sprint_id)
            ->first();

        if ($predecessor === null) {
            return false;
        }

        $deadline = $predecessor->deadline_at;
        $start = $anchor->started_at;

        if ($deadline === null || ($start !== null && $start->equalTo($deadline))) {
            return false;
        }

        $this->shiftTask($anchor, $deadline);

        return true;
    }

    private function pushTaskChain(Task $anchor): bool
    {
        $previous = $anchor;
        $moved = false;

        while ($previous->next_task_id !== null) {
            $current = Task::find($previous->next_task_id);

            if ($current === null || $current->sprint_id !== $anchor->sprint_id) {
                break;
            }

            $deadline = $previous->deadline_at;
            $start = $current->started_at;

            if ($deadline === null || ($start !== null && $start->equalTo($deadline))) {
                break;
            }

            $this->shiftTask($current, $deadline);
            $previous = $current;
            $moved = true;
        }

        return $moved;
    }

    private function shiftTask(Task $task, Carbon $newStart): void
    {
        $oldStart = $task->started_at;
        $oldDeadline = $task->deadline_at;

        $task->started_at = $newStart;

        if ($oldStart !== null && $oldDeadline !== null) {
            $task->deadline_at = $newStart->copy()->addDays(abs($oldDeadline->diffInDays($oldStart)));
        } elseif ($oldDeadline !== null) {
            $task->deadline_at = $newStart->copy();
        }

        $task->save();
    }

    private function rebalanceSprintChain(Sprint $startSprint): void
    {
        $sprintsById = $startSprint->project->sprints->keyBy('id');
        $visited = [];
        $current = $startSprint;
        $previousEnd = null;

        while ($current !== null && ! isset($visited[$current->id])) {
            $visited[$current->id] = true;

            $tasks = $current->tasks;
            $earliestStart = $this->earliestStart($tasks);

            if ($earliestStart !== null) {
                if ($previousEnd !== null && $earliestStart->lt($previousEnd)) {
                    $shiftDays = max(1, (int) ceil(abs($previousEnd->diffInDays($earliestStart))));

                    foreach ($tasks as $task) {
                        $baseStart = $task->started_at ?? $earliestStart;
                        $this->shiftTask($task, $baseStart->copy()->addDays($shiftDays));
                    }
                }

                $end = $this->maxDeadline($tasks);

                if ($end !== null) {
                    $previousEnd = $previousEnd === null || $end->greaterThan($previousEnd) ? $end : $previousEnd;
                }
            }

            $current = isset($sprintsById[$current->next_sprint_id])
                ? $sprintsById[$current->next_sprint_id]
                : null;
        }
    }

    /**
     * @param  Collection<int, Task>  $tasks
     */
    private function earliestStart(Collection $tasks): ?Carbon
    {
        return $tasks->reduce(function (?Carbon $carry, Task $task): ?Carbon {
            $start = $task->started_at;

            if ($start === null) {
                return $carry;
            }

            return $carry === null || $start->lessThan($carry) ? $start : $carry;
        }, null);
    }

    /**
     * @param  Collection<int, Task>  $tasks
     */
    private function maxDeadline(Collection $tasks): ?Carbon
    {
        return $tasks->reduce(function (?Carbon $carry, Task $task): ?Carbon {
            $deadline = $task->deadline_at;

            if ($deadline === null) {
                return $carry;
            }

            return $carry === null || $deadline->greaterThan($carry) ? $deadline : $carry;
        }, null);
    }
}
