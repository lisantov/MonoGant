<?php

namespace App\Actions\Task;

use App\Enums\StatusEnum;
use App\Models\Sprint;
use App\Models\Task;
use Illuminate\Support\Carbon;
use Lorisleiva\Actions\Concerns\AsAction;

class CreateTaskAction
{
    use AsAction;

    public function handle(array $data, Sprint $sprint): Task
    {
        if (isset($data['started_at'])) {
            $data['status'] = Carbon::parse($data['started_at'])->lt(now())
                ? StatusEnum::InProgress
                : StatusEnum::Planned;
        }

        return Task::create([...$data, 'sprint_id' => $sprint->id]);
    }
}
