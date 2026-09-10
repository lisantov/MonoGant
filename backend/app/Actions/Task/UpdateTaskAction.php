<?php

namespace App\Actions\Task;

use App\Actions\Scheduling\RescheduleAction;
use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Lorisleiva\Actions\Concerns\AsAction;

class UpdateTaskAction
{
    use AsAction;

    public function handle(Task $task, array $data): Task
    {
        return DB::transaction(function () use ($task, $data): Task {
            $schedulingKeysPresent = array_key_exists('next_task_id', $data)
                || array_key_exists('started_at', $data)
                || array_key_exists('deadline_at', $data);

            if (array_key_exists('user_email', $data)) {
                if ($data['user_email'] === null) {
                    $data['user_id'] = null;
                    unset($data['user_email']);
                } else {
                    $user = User::where('email', $data['user_email'])->first();

                    if ($user === null || ! $task->sprint->project->members()->where('users.id', $user->id)->exists()) {
                        throw ValidationException::withMessages(['user_email' => 'The assigned user is not a member of the project.']);
                    }

                    $data['user_id'] = $user->id;
                    unset($data['user_email']);
                }
            }

            if (isset($data['next_task_id'])) {
                $this->assertValidNextTask($task, $data['next_task_id']);
            }

            $task->update($data);

            if ($schedulingKeysPresent) {
                RescheduleAction::run($task);
            }

            return $task->fresh();
        });
    }

    private function assertValidNextTask(Task $task, int $nextTaskId): void
    {
        if ($nextTaskId === $task->id) {
            throw ValidationException::withMessages(['next_task_id' => 'A task cannot follow itself.']);
        }

        $nextTask = Task::find($nextTaskId);

        if ($nextTask === null || $nextTask->sprint_id !== $task->sprint_id) {
            throw ValidationException::withMessages(['next_task_id' => 'The next task must belong to the same sprint.']);
        }

        $alreadyLinked = Task::where('next_task_id', $nextTaskId)
            ->where('id', '!=', $task->id)
            ->exists();

        if ($alreadyLinked) {
            throw ValidationException::withMessages(['next_task_id' => 'The next task is already linked to another task.']);
        }
    }
}
