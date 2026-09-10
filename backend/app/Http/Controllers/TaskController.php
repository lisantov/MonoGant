<?php

namespace App\Http\Controllers;

use App\Actions\Task\AddTaskDependencyAction;
use App\Actions\Task\CreateTaskAction;
use App\Actions\Task\RemoveTaskDependencyAction;
use App\Actions\Task\UpdateTaskAction;
use App\Http\Requests\Task\RemoveTaskDependencyRequest;
use App\Http\Requests\Task\StoreTaskDependencyRequest;
use App\Http\Requests\Task\StoreTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Sprint;
use App\Models\Task;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class TaskController extends Controller
{
    public function index(Sprint $sprint)
    {
        return TaskResource::collection($sprint->tasks);
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
        return new TaskResource($task);
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        $this->authorizeSprint($task->sprint);

        $task = UpdateTaskAction::run($task, $request->validated());

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

    public function linkDependency(StoreTaskDependencyRequest $request, Task $task)
    {
        $this->authorizeSprint($task->sprint);

        AddTaskDependencyAction::run($task, $request->validated());

        return response()->json([
            'message' => 'Dependency linked successfully',
        ]);
    }

    public function unlinkDependency(RemoveTaskDependencyRequest $request, Task $task)
    {
        $this->authorizeSprint($task->sprint);

        RemoveTaskDependencyAction::run($task, $request->validated());

        return response()->json([
            'message' => 'Dependency unlinked successfully',
        ]);
    }

    private function authorizeSprint(Sprint $sprint): void
    {
        if (! Gate::inspect('update', $sprint->project)->allowed()) {
            throw new AccessDeniedHttpException;
        }
    }
}
