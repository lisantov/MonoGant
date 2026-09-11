<?php

namespace App\Http\Controllers;

use App\Actions\Task\CreateTaskAction;
use App\Actions\Task\IndexTasksAction;
use App\Actions\Task\UpdateTaskAction;
use App\Http\Requests\Task\StoreTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Sprint;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class TaskController extends Controller
{
    public function index(Request $request, Sprint $sprint)
    {
        if (! Gate::inspect('project-show', $sprint->project)->allowed()) {
            throw new AccessDeniedHttpException;
        }
        $tasks = IndexTasksAction::run($request->all(), $sprint);

        return TaskResource::collection($tasks);
    }

    public function store(StoreTaskRequest $request, Sprint $sprint)
    {
        $this->authorizeSprint($sprint);

        $task = CreateTaskAction::run($request->validated(), $sprint);

        return response()->json([
            'message' => 'Task created successfully',
            'task' => new TaskResource($task),
        ], 201);
    }

    public function show(Task $task)
    {
        if (! Gate::inspect('project-show', $task->sprint->project)->allowed()) {
            throw new AccessDeniedHttpException;
        }

        return new TaskResource($task);
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        $project = $task->sprint->project;
        $validated = $request->validated();

        if (! Gate::inspect('project-member', $project)->allowed()) {
            throw new AccessDeniedHttpException;
        }

        if (Gate::inspect('project-edit', $project)->allowed()) {
            $task = UpdateTaskAction::run($task, $validated);
        } else {
            if ($task->user_id !== $request->user()->id) {
                throw new AccessDeniedHttpException;
            }

            if (array_diff(array_keys($validated), ['status']) !== []) {
                throw new AccessDeniedHttpException;
            }

            $task = UpdateTaskAction::run($task, $validated);
        }

        return response()->json([
            'message' => 'Task updated successfully',
            'task' => new TaskResource($task),
        ]);
    }

    public function destroy(Task $task)
    {
        $this->authorizeSprint($task->sprint);

        $task->delete();

        return response()->json([
            'message' => 'Task deleted successfully',
        ]);
    }

    private function authorizeSprint(Sprint $sprint): void
    {
        if (! Gate::inspect('project-edit', $sprint->project)->allowed()) {
            throw new AccessDeniedHttpException;
        }
    }
}
