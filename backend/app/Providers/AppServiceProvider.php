<?php

namespace App\Providers;

use App\Enums\RoleEnum;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        /**
         * User is member of project (no role check)
         */
        Gate::define('project-member', function (User $user, Project $project) {
            return $project->members()->where('user_id', $user->id)->exists();
        });

        /**
         * User is owner of project
         */
        Gate::define('project-owner', function (User $user, Project $project) {
            return $project->members()->where(['user_id' => $user->id, 'role' => RoleEnum::Owner])->exists();
        });

        /**
         * User can show project (member)
         */
        Gate::define('project-show', function (User $user, Project $project) {
            return Gate::forUser($user)->allows('project-member', $project);
        });

        /**
         * User can edit project content (owner or responsible)
         */
        Gate::define('project-edit', function (User $user, Project $project) {
            return $project->members()
                ->where('user_id', $user->id)
                ->whereIn('role', [RoleEnum::Owner, RoleEnum::Responsible])
                ->exists();
        });

        /**
         * User can delete project (owner)
         */
        Gate::define('project-delete', function (User $user, Project $project) {
            return Gate::forUser($user)->allows('project-owner', $project);
        });

        /**
         * User can invite members (owner or responsible)
         */
        Gate::define('project-invite', function (User $user, Project $project) {
            return Gate::forUser($user)->allows('project-edit', $project);
        });

        /**
         * User can set member roles (owner)
         */
        Gate::define('project-set-role', function (User $user, Project $project) {
            return Gate::forUser($user)->allows('project-owner', $project);
        });

        /**
         * User can remove members (owner or responsible)
         */
        Gate::define('project-remove-member', function (User $user, Project $project) {
            return Gate::forUser($user)->allows('project-edit', $project);
        });
    }
}
