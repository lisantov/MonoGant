<?php

namespace App\Actions\Project;

use App\Enums\RoleEnum;
use App\Models\Project;
use App\Models\ProjectUser;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use Lorisleiva\Actions\Concerns\AsAction;

class RemoveProjectMemberAction
{
    use AsAction;

    public function handle(Project $project, User $member): void
    {
        $pivot = ProjectUser::where('project_id', $project->id)
            ->where('user_id', $member->id)
            ->first();

        if ($pivot === null) {
            throw ValidationException::withMessages(['member' => 'This user is not a member of the project.']);
        }

        if ($pivot->role === RoleEnum::Owner) {
            throw ValidationException::withMessages(['member' => 'The project owner cannot be removed.']);
        }

        $pivot->delete();
    }
}
