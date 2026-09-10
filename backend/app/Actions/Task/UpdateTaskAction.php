<?php

namespace App\Actions\Task;

use App\Models\Task;
use Lorisleiva\Actions\Concerns\AsAction;

class UpdateTaskAction
{
    use AsAction;

    public function handle(Task $task, array $data): Task
    {
        $task->update($data);

        return $task->fresh();
    }
}
