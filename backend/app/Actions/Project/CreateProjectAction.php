<?php

namespace App\Actions\Project;

use App\Enums\RoleEnum;
use App\Enums\StatusEnum;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Lorisleiva\Actions\Concerns\AsAction;

class CreateProjectAction
{
    use AsAction;

    public function handle(array $data, User $user): Project
    {
        return DB::transaction(function () use ($data, $user): Project {
            if (isset($data['started_at'])) {
                $data['status'] = Carbon::parse($data['started_at'])->lt(now())
                    ? StatusEnum::InProgress
                    : StatusEnum::Planned;
            }

            $project = Project::create($data);

            $project->members()->attach($user->id, ['role' => RoleEnum::Owner]);

            return $project;
        });
    }
}
