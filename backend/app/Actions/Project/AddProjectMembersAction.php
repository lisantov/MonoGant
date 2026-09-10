<?php

namespace App\Actions\Project;

use App\Enums\RoleEnum;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Lorisleiva\Actions\Concerns\AsAction;

class AddProjectMembersAction
{
    use AsAction;

    /**
     * @return Collection<int, User>
     */
    public function handle(array $emails, Project $project): Collection
    {
        return DB::transaction(function () use ($emails, $project): Collection {
            $existingIds = $project->members()->pluck('users.id')->all();

            $users = User::query()
                ->whereIn('email', $emails)
                ->whereNotIn('id', $existingIds)
                ->get();

            if ($users->isEmpty()) {
                return $users;
            }

            $project->members()->attach(
                $users->pluck('id')->all(),
                ['role' => RoleEnum::Member],
            );

            return $users;
        });
    }
}
