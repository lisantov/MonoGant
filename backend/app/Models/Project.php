<?php

namespace App\Models;

use App\Enums\RoleEnum;
use App\Enums\StatusEnum;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

#[Fillable(
    [
        'name',
        'started_at',
        'deadline_at',
        'status',
    ])
]
class Project extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'deadline_at' => 'datetime',
            'status' => StatusEnum::class,
        ];
    }

    public function owner(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'project_user')
            ->wherePivot('role', RoleEnum::Owner->value)
            ->using(ProjectUser::class);
    }

    public function responsible(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'project_user')
            ->wherePivot('role', RoleEnum::Responsible->value)
            ->using(ProjectUser::class);
    }

    public function sprints(): HasMany
    {
        return $this->hasMany(Sprint::class);
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'project_user')
            ->withPivot('role')
            ->using(ProjectUser::class);
    }

    public function extendDeadlineTo(?Carbon $deadlineAt): void
    {
        if ($this->deadline_at === null || $deadlineAt === null || ! $deadlineAt->greaterThan($this->deadline_at)) {
            return;
        }

        $this->update(['deadline_at' => $deadlineAt]);
    }

    private function projectTasks(): Collection
    {
        return $this->sprints->loadMissing('tasks')->flatMap->tasks;
    }

    public function completedTasksCount(): int
    {
        return $this->projectTasks()
            ->filter(fn (Task $task) => $task->status === StatusEnum::Done)
            ->count();
    }

    public function totalTasksCount(): int
    {
        return $this->projectTasks()
            ->filter(fn (Task $task) => $task->status !== StatusEnum::Cancelled)
            ->count();
    }

    public function completionPercentage(): int
    {
        $total = $this->totalTasksCount();

        if ($total === 0) {
            return 0;
        }

        return (int) round($this->completedTasksCount() / $total * 100);
    }
}
