<?php

namespace App\Actions\Scheduling;

use App\Models\Sprint;
use App\Models\Task;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Lorisleiva\Actions\Concerns\AsAction;

/**
 * Перебалансирует раскид после привязки задачи или изменения ее дат.
 *
 *  Связанные задачи (те, у которых есть next_task_id или предшественник) передвигаются вперед.
 *  таким образом, каждый преемник начинает работу в срок своего предшественника, используя наименьший срок
 *  сдвига (как башенка). Неприкрепленные задачи никогда не перемещаются и могут перекрываться. Если
 *  дедлайн переходит в следующий спринт, то следуюущие
 *  задачи этого спринта сдвигаются на минимальную величину, чтобы восстановить нулевой разрыв.
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

        if ($deadline === null || ($start !== null && ! $start->lt($deadline))) {
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

            if ($deadline === null || ($start !== null && ! $start->lt($deadline))) {
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

            $chains = $this->chainedChains($current);

            if ($chains->isNotEmpty()) {
                if ($previousEnd === null) {
                    $previousEnd = $this->maxDeadline($chains->flatten(1));
                } else {
                    foreach ($chains as $tasks) {
                        $headStart = $tasks->first()->started_at;

                        if ($headStart === null) {
                            continue;
                        }

                        if ($headStart->lt($previousEnd)) {
                            $shiftDays = max(1, (int) ceil(abs($previousEnd->diffInDays($headStart))));

                            foreach ($tasks as $task) {
                                $baseStart = $task->started_at ?? $headStart;
                                $this->shiftTask($task, $baseStart->copy()->addDays($shiftDays));
                            }
                        }

                        $end = $this->maxDeadline($tasks);

                        if ($end !== null) {
                            $previousEnd = $previousEnd->greaterThanOrEqualTo($end) ? $previousEnd : $end;
                        }
                    }
                }
            }

            $current = isset($sprintsById[$current->next_sprint_id])
                ? $sprintsById[$current->next_sprint_id]
                : null;
        }
    }

    /**
     * @return Collection<int, Collection<int, Task>>
     */
    private function chainedChains(Sprint $sprint): Collection
    {
        $tasks = $sprint->tasks;
        $ids = $tasks->pluck('id');
        $referencedIds = Task::whereIn('next_task_id', $ids)->pluck('next_task_id');

        $chained = $tasks->filter(
            fn (Task $task) => $task->next_task_id !== null || $referencedIds->contains($task->id)
        );

        $byId = $chained->keyBy('id');
        $heads = $chained
            ->reject(fn (Task $task) => $referencedIds->contains($task->id))
            ->sortBy(fn (Task $task) => $task->started_at?->timestamp ?? PHP_INT_MAX)
            ->values();

        return $heads->map(function (Task $head) use ($byId): Collection {
            $tasks = collect([$head]);
            $guard = [$head->id => true];
            $current = $head;

            while ($current->next_task_id !== null
                && isset($byId[$current->next_task_id])
                && ! isset($guard[$current->next_task_id])) {
                $current = $byId[$current->next_task_id];
                $guard[$current->id] = true;
                $tasks->push($current);
            }

            return $tasks;
        });
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
