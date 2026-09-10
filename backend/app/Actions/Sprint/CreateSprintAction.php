<?php

namespace App\Actions\Sprint;

use App\Enums\StatusEnum;
use App\Models\Project;
use App\Models\Sprint;
use Lorisleiva\Actions\Concerns\AsAction;

class CreateSprintAction
{
    use AsAction;

    public function handle(array $data, Project $project): Sprint
    {
        if (! isset($data['status'])) {
            $data['status'] = StatusEnum::Planned;
        }

        return Sprint::create([...$data, 'project_id' => $project->id]);
    }
}
