<?php

namespace App\Actions\Project;

use App\Enums\RoleEnum;
use App\Models\Project;
use App\Models\ProjectUser;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Lorisleiva\Actions\Concerns\AsAction;

class SetProjectMemberRoleAction
{
    use AsAction;

    public function handle(Project $project, User $member, RoleEnum $role): ProjectUser
    {
        $pivot = ProjectUser::where('project_id', $project->id)
            ->where('user_id', $member->id)
            ->first();

        if ($pivot === null) {
            throw ValidationException::withMessages(['member' => 'This user is not a member of the project.']);
        }

        if ($pivot->role === RoleEnum::Owner) {
            throw ValidationException::withMessages(['role' => 'The owner role cannot be changed.']);
        }

        if ($role === RoleEnum::Responsible) {
            $hasResponsible = ProjectUser::where('project_id', $project->id)
                ->where('role', RoleEnum::Responsible)
                ->where('user_id', '!=', $member->id)
                ->exists();

            if ($hasResponsible) {
                throw ValidationException::withMessages(['role' => 'This project already has a responsible member.']);
            }
        }

        return DB::transaction(function () use ($pivot, $role): ProjectUser {
            $pivot->update(['role' => $role]);

            return $pivot;
        });
    }
}
