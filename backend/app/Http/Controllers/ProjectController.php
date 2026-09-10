<?php

namespace App\Http\Controllers;

use App\Actions\Project\CreateProjectAction;
use App\Http\Requests\Project\CreateProjectRequest;
use App\Http\Requests\Project\UpdateProjectRequest;
use App\Http\Resources\Parse\ParseProjectResource;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
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
        if (Gate::inspect('project-update', $project)->allowed()) {
            $project->update($request->validated());

            return response()->json(new ProjectResource($project));
        } else {
            throw new AccessDeniedHttpException;
        }

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
