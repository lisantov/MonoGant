<?php

namespace App\Actions\Task;

use App\Models\Sprint;
use Illuminate\Database\Eloquent\Builder;
use Lorisleiva\Actions\Concerns\AsAction;

class IndexTasksAction
{
    use AsAction;

    public function handle(array $data, Sprint $sprint)
    {
        $tasks = $sprint->tasks();
        if (isset($data['name']) && ! empty($data['name'])) {
            $tasks = $tasks->where('name', 'like', '%'.$data['name'].'%');
        }

        if (isset($data['description']) && ! empty($data['description'])) {
            $tasks = $tasks->where('description', 'like', '%'.$data['description'].'%');
        }

        if (isset($data['date']) && ! empty($data['date'])) {
            $tasks = $tasks->whereDate('started_at', '<=', $data['date'])
                ->whereDate('deadline_at', '>=', $data['date']);
        }

        if (isset($data['user_email']) && ! empty($data['user_email'])) {
            $tasks = $tasks->whereHas('user', fn (Builder $query) => $query->where('email', 'like', '%'.$data['user_email'].'%'));
        }

        return $tasks->get();
    }
}
