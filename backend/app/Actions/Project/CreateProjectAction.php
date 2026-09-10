<?php

namespace App\Actions\Project;

use App\Enums\RoleEnum;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Lorisleiva\Actions\Concerns\AsAction;

class CreateProjectAction
{
    use AsAction;

    public function handle(array $data, User $user): Project
    {
        return DB::transaction(function () use ($data, $user): Project {
            $project = Project::create($data);

            $project->members()->attach($user->id, ['role' => RoleEnum::Owner]);

            return $project;
        });
    }
}
