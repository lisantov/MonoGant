<?php

namespace App\Actions\Task;

use App\Models\Task;
use Lorisleiva\Actions\Concerns\AsAction;

class RemoveTaskDependencyAction
{
    use AsAction;

    public function handle(Task $task, array $data): void
    {
        if (isset($data['predecessor_id'])) {
            $task->predecessors()->detach($data['predecessor_id']);
        }

        if (isset($data['successor_id'])) {
            $task->successors()->detach($data['successor_id']);
        }
    }
}
