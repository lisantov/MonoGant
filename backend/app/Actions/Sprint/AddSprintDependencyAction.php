<?php

namespace App\Actions\Sprint;

use App\Models\Sprint;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Validation\ValidationException;
use Lorisleiva\Actions\Concerns\AsAction;

class AddSprintDependencyAction
{
    use AsAction;

    public function handle(Sprint $sprint, array $data): void
    {
        if (isset($data['predecessor_id'])) {
            $this->link($sprint, $sprint->predecessors(), $data['predecessor_id']);
        }

        if (isset($data['successor_id'])) {
            $this->link($sprint, $sprint->successors(), $data['successor_id']);
        }
    }

    private function link(Sprint $sprint, BelongsToMany $relation, int $dependencyId): void
    {
        if ($sprint->id === $dependencyId) {
            throw ValidationException::withMessages([
                'dependency_id' => ['A sprint cannot depend on itself.'],
            ]);
        }

        if (! $relation->whereKey($dependencyId)->exists()) {
            $relation->attach($dependencyId);
        }
    }
}
