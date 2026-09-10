<?php

namespace App\Actions\Task;

use App\Models\Task;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Validation\ValidationException;
use Lorisleiva\Actions\Concerns\AsAction;

class AddTaskDependencyAction
{
    use AsAction;

    public function handle(Task $task, array $data): void
    {
        if (isset($data['predecessor_id'])) {
            $this->link($task, $task->predecessors(), $data['predecessor_id']);
        }

        if (isset($data['successor_id'])) {
            $this->link($task, $task->successors(), $data['successor_id']);
        }
    }

    private function link(Task $task, BelongsToMany $relation, int $dependencyId): void
    {
        if ($task->id === $dependencyId) {
            throw ValidationException::withMessages([
                'dependency_id' => ['A task cannot depend on itself.'],
            ]);
        }

        if (! $relation->whereKey($dependencyId)->exists()) {
            $relation->attach($dependencyId);
        }
    }
}
