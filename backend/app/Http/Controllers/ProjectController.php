<?php

namespace App\Http\Controllers;

use App\Actions\Project\AddProjectMembersAction;
use App\Actions\Project\CreateProjectAction;
use App\Actions\Project\RemoveProjectMemberAction;
use App\Actions\Project\SetProjectMemberRoleAction;
use App\Enums\RoleEnum;
use App\Http\Requests\Project\CreateProjectRequest;
use App\Http\Requests\Project\RemoveProjectMemberRequest;
use App\Http\Requests\Project\SetProjectMemberRoleRequest;
use App\Http\Requests\Project\StoreProjectMembersRequest;
use App\Http\Requests\Project\UpdateProjectRequest;
use App\Http\Resources\Parse\ParseProjectResource;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\UserResource;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ProjectResource::collection(request()->user()->projects);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(CreateProjectRequest $request)
    {
        $project = CreateProjectAction::run($request->validated(), $request->user());

        return response()->json([
            'message' => 'Project created successfully',
            'project' => new ProjectResource($project),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        if (! Gate::inspect('project-show', $project)->allowed()) {
            throw new AccessDeniedHttpException;
        }

        return new ProjectResource($project);
    }

    /**
     * Ultraparse of project (full info about project)
     */
    public function parse(Project $project)
    {
        if (! Gate::inspect('project-show', $project)->allowed()) {
            throw new AccessDeniedHttpException;
        }

        return response()->json([
            'project' => new ParseProjectResource($project),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project)
    {
        if (! Gate::inspect('project-edit', $project)->allowed()) {
            throw new AccessDeniedHttpException;
        }

        $project->update($request->validated());

        return response()->json(new ProjectResource($project));
    }

    /**
     * Add members to the project by email (owner or responsible)
     */
    public function storeMembers(StoreProjectMembersRequest $request, Project $project)
    {
        if (! Gate::inspect('project-invite', $project)->allowed()) {
            throw new AccessDeniedHttpException;
        }

        $members = AddProjectMembersAction::run($request->validated()['emails'], $project);

        return response()->json([
            'message' => 'Members added successfully',
            'count' => $members->count(),
            'members' => UserResource::collection($members),
        ], 201);
    }

    /**
     * Set a member role (owner only, member between Member and Responsible)
     */
    public function setMemberRole(SetProjectMemberRoleRequest $request, Project $project, User $member)
    {
        if (! Gate::inspect('project-set-role', $project)->allowed()) {
            throw new AccessDeniedHttpException;
        }

        $pivot = SetProjectMemberRoleAction::run($project, $member, RoleEnum::from($request->validated()['role']));

        return response()->json([
            'message' => 'Member role updated successfully',
            'member' => [
                'user' => new UserResource($member),
                'role' => $pivot->role,
            ],
        ]);
    }

    /**
     * Remove a member from the project by email (owner or responsible)
     */
    public function removeMemberByEmail(RemoveProjectMemberRequest $request, Project $project)
    {
        if (! Gate::inspect('project-remove-member', $project)->allowed()) {
            throw new AccessDeniedHttpException;
        }

        $member = User::where('email', $request->validated()['email'])->firstOrFail();

        RemoveProjectMemberAction::run($project, $member);

        return response()->json([
            'message' => 'Member removed successfully',
        ]);
    }

    /**
     * Remove a member from the project (owner or responsible)
     */
    public function removeMember(Project $project, User $member)
    {
        if (! Gate::inspect('project-remove-member', $project)->allowed()) {
            throw new AccessDeniedHttpException;
        }

        RemoveProjectMemberAction::run($project, $member);

        return response()->json([
            'message' => 'Member removed successfully',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        if (Gate::inspect('project-delete', $project)->allowed()) {
            $project->delete();

            return response()->json(null, 204);
        }
        throw new AccessDeniedHttpException;
    }
}
