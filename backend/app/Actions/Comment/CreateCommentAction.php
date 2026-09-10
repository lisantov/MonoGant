<?php

namespace App\Actions\Comment;

use App\Models\Comment;
use App\Models\Task;
use App\Models\User;
use Lorisleiva\Actions\Concerns\AsAction;

class CreateCommentAction
{
    use AsAction;

    public function handle(array $data, Task $task, User $user): Comment
    {
        return Comment::create([
            ...$data,
            'user_id' => $user->id,
            'task_id' => $task->id,
        ]);
    }
}
