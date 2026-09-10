<?php

namespace App\Actions\Sprint;

use App\Enums\StatusEnum;
use App\Models\Project;
use App\Models\Sprint;
use Illuminate\Support\Carbon;
use Lorisleiva\Actions\Concerns\AsAction;

class CreateSprintAction
{
    use AsAction;

    public function handle(array $data, Project $project): Sprint
    {
        if (isset($data['started_at'])) {
            $data['status'] = Carbon::parse($data['started_at'])->lt(now())
                ? StatusEnum::InProgress
                : StatusEnum::Planned;
        }

        return Sprint::create([...$data, 'project_id' => $project->id]);
    }
}
