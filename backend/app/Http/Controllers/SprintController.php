<?php

namespace App\Http\Controllers;

use App\Actions\Sprint\CreateSprintAction;
use App\Actions\Sprint\UpdateSprintAction;
use App\Http\Requests\Sprint\StoreSprintRequest;
use App\Http\Requests\Sprint\UpdateSprintRequest;
use App\Http\Resources\SprintResource;
use App\Models\Project;
use App\Models\Sprint;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class SprintController extends Controller
{
    public function index(Project $project)
    {
        if (! Gate::inspect('project-show', $project)->allowed()) {
            throw new AccessDeniedHttpException;
        }

        return SprintResource::collection($project->sprints);
    }

    public function store(StoreSprintRequest $request, Project $project)
    {
        $this->authorizeProject($project);

        $sprint = CreateSprintAction::run($request->validated(), $project);

        return response()->json([
            'message' => 'Sprint created successfully',
            'sprint' => new SprintResource($sprint),
        ], 201);
    }

    public function show(Sprint $sprint)
    {
        if (! Gate::inspect('project-show', $sprint->project)->allowed()) {
            throw new AccessDeniedHttpException;
        }

        return new SprintResource($sprint);
    }

    public function update(UpdateSprintRequest $request, Sprint $sprint)
    {
        $this->authorizeProject($sprint->project);

        $sprint = UpdateSprintAction::run($sprint, $request->validated());

        return response()->json([
            'message' => 'Sprint updated successfully',
            'sprint' => new SprintResource($sprint),
        ]);
    }

    public function destroy(Sprint $sprint)
    {
        $this->authorizeProject($sprint->project);

        $sprint->delete();

        return response()->json([

        ], 204);
    }

    private function authorizeProject(Project $project): void
    {
        if (! Gate::inspect('project-edit', $project)->allowed()) {
            throw new AccessDeniedHttpException;
        }
    }
}
