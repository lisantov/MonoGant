<?php

namespace App\Http\Controllers;

use App\Actions\Comment\CreateCommentAction;
use App\Http\Requests\Comment\StoreCommentRequest;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Sprint;
use App\Models\Task;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class CommentController extends Controller
{
    public function index(Task $task)
    {
        if (! Gate::inspect('project-show', $task->sprint->project)->allowed()) {
            throw new AccessDeniedHttpException;
        }

        return CommentResource::collection($task->comments);
    }

    public function store(StoreCommentRequest $request, Task $task)
    {
        $this->authorizeSprint($task->sprint);

        $comment = CreateCommentAction::run($request->validated(), $task, $request->user());

        return response()->json([
            'message' => 'Comment created successfully',
            'comment' => new CommentResource($comment),
        ], 201);
    }

    public function show(Comment $comment)
    {
        if (! Gate::inspect('project-show', $comment->task->sprint->project)->allowed()) {
            throw new AccessDeniedHttpException;
        }

        return new CommentResource($comment);
    }

    private function authorizeSprint(Sprint $sprint): void
    {
        if (! Gate::inspect('project-member', $sprint->project)->allowed()) {
            throw new AccessDeniedHttpException;
        }
    }
}
