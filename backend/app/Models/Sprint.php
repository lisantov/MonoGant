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
}
