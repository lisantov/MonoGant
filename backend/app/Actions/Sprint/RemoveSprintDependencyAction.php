<?php

namespace App\Actions\Sprint;

use App\Models\Sprint;
use Lorisleiva\Actions\Concerns\AsAction;

class RemoveSprintDependencyAction
{
    use AsAction;

    public function handle(Sprint $sprint, array $data): void
    {
        if (isset($data['predecessor_id'])) {
            $sprint->predecessors()->detach($data['predecessor_id']);
        }

        if (isset($data['successor_id'])) {
            $sprint->successors()->detach($data['successor_id']);
        }
    }
}
