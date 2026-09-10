<?php

namespace App\Actions\Sprint;

use App\Models\Sprint;
use Illuminate\Validation\ValidationException;
use Lorisleiva\Actions\Concerns\AsAction;

class UpdateSprintAction
{
    use AsAction;

    public function handle(Sprint $sprint, array $data): Sprint
    {
        if (isset($data['next_sprint_id'])) {
            $this->assertValidNextSprint($sprint, $data['next_sprint_id']);
        }

        $sprint->update($data);

        return $sprint->fresh();
    }

    private function assertValidNextSprint(Sprint $sprint, int $nextSprintId): void
    {
        if ($nextSprintId === $sprint->id) {
            throw ValidationException::withMessages(['next_sprint_id' => 'A sprint cannot follow itself.']);
        }

        $nextSprint = Sprint::find($nextSprintId);

        if ($nextSprint === null || $nextSprint->project_id !== $sprint->project_id) {
            throw ValidationException::withMessages(['next_sprint_id' => 'The next sprint must belong to the same project.']);
        }

        $alreadyLinked = Sprint::where('next_sprint_id', $nextSprintId)
            ->where('id', '!=', $sprint->id)
            ->exists();

        if ($alreadyLinked) {
            throw ValidationException::withMessages(['next_sprint_id' => 'The next sprint is already linked to another sprint.']);
        }
    }
}
