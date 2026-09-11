<?php

namespace App\Actions\Task;

use App\Enums\StatusEnum;
use App\Models\Project;
use App\Models\Sprint;
use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Lorisleiva\Actions\Concerns\AsAction;

class CreateTaskAction
{
    use AsAction;

    public function handle(array $data, Sprint $sprint): Task
    {
        return DB::transaction(function () use ($data, $sprint): Task {
            if (isset($data['started_at'])) {
                $data['status'] = Carbon::parse($data['started_at'])->lt(now())
                    ? StatusEnum::InProgress
                    : StatusEnum::Planned;
            }

            $this->resolveAssignee($data, $sprint->project);

            $task = Task::create([...$data, 'sprint_id' => $sprint->id]);

            $sprint->project->extendDeadlineTo($sprint->deadline_at());

            return $task;
        });
    }

    private function resolveAssignee(array &$data, Project $project): void
    {
        if (! isset($data['user_email'])) {
            return;
        }

        $user = User::where('email', $data['user_email'])->first();

        if ($user === null || ! $project->members()->where('users.id', $user->id)->exists()) {
            throw ValidationException::withMessages(['user_email' => 'The assigned user is not a member of the project.']);
        }

        $data['user_id'] = $user->id;
        unset($data['user_email']);
    }
}
