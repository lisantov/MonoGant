<?php

namespace App\Models;

use App\Enums\StatusEnum;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

#[Fillable([
    'name',
    'description',
    'status',
    'project_id',
    'next_sprint_id',
])]
class Sprint extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'status' => StatusEnum::class,
        ];
    }

    public function next_sprint(): BelongsTo
    {
        return $this->belongsTo(Sprint::class, 'next_sprint_id');
    }

    public function previous_sprint(): HasOne
    {
        return $this->hasOne(Sprint::class, 'next_sprint_id');
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function started_at(): ?Carbon
    {
        $startedAt = $this->tasks()->min('started_at');

        return $startedAt ? Carbon::parse($startedAt) : null;
    }

    public function deadline_at(): ?Carbon
    {
        $deadlineAt = $this->tasks()->max('deadline_at');

        return $deadlineAt ? Carbon::parse($deadlineAt) : null;
    }

    public function overlappingSprint(Carbon $start, Carbon $deadline): ?Sprint
    {
        return $this->project->sprints->first(function (Sprint $sprint) use ($start, $deadline): bool {
            if ($sprint->is($this)) {
                return false;
            }

            $otherStart = $sprint->started_at();
            $otherDeadline = $sprint->deadline_at();

            return $otherStart !== null
                && $otherDeadline !== null
                && $start->lte($otherDeadline)
                && $deadline->gte($otherStart);
        });
    }

    /**
     * Возвращает цепочку спринтов, к которой принадлежит текущий спринт,
     * в порядке от головы (по next_sprint_id).
     *
     * @return list<Sprint>
     */
    public function chain(): array
    {
        $byId = $this->project->sprints->keyBy('id');
        $seen = [];
        $head = $this;

        while (true) {
            $predecessor = $byId->first(fn (Sprint $sprint): bool => $sprint->next_sprint_id === $head->id);

            if ($predecessor === null || isset($seen[$predecessor->id])) {
                break;
            }

            $seen[$predecessor->id] = true;
            $head = $predecessor;
        }

        $chain = [];
        $visited = [];
        $current = $head;

        while ($current !== null && ! isset($visited[$current->id])) {
            $visited[$current->id] = true;
            $chain[] = $current;
            $current = isset($byId[$current->next_sprint_id]) ? $byId[$current->next_sprint_id] : null;
        }

        return $chain;
    }

    /**
     * Проверяет, что диапазон дат не пересекается с другими спринтами проекта
     * и не нарушает хронологический порядок цепочки спринтов.
     *
     * Возвращает описание конфликта или null, если всё в порядке.
     */
    public function dateRangeConflict(Carbon $start, Carbon $deadline): ?string
    {
        $overlap = $this->overlappingSprint($start, $deadline);

        if ($overlap !== null) {
            return "The task dates overlap sprint \"{$overlap->name}\".";
        }

        $chain = $this->chain();
        $index = null;

        foreach ($chain as $position => $sprint) {
            if ($sprint->is($this)) {
                $index = $position;
                break;
            }
        }

        if ($index === null) {
            return null;
        }

        foreach ($chain as $position => $sprint) {
            if ($position === $index) {
                continue;
            }

            $otherStart = $sprint->started_at();
            $otherDeadline = $sprint->deadline_at();

            if ($otherStart === null || $otherDeadline === null) {
                continue;
            }

            if ($position < $index && $start->lt($otherDeadline)) {
                return "The task dates fall within the time span of sprint \"{$sprint->name}\", which precedes \"{$this->name}\" in the chain.";
            }

            if ($position > $index && $deadline->gt($otherStart)) {
                return "The task dates fall within the time span of sprint \"{$sprint->name}\", which follows \"{$this->name}\" in the chain.";
            }
        }

        return null;
    }

    public function completedTasksCount(): int
    {
        return $this->tasks->filter(fn (Task $task): bool => $task->status === StatusEnum::Done)->count();
    }

    public function totalTasksCount(): int
    {
        return $this->tasks->filter(fn (Task $task): bool => $task->status !== StatusEnum::Cancelled)->count();
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
