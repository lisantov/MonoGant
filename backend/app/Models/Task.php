<?php

namespace App\Models;

use App\Enums\StatusEnum;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'name',
    'description',
    'started_at',
    'deadline_at',
    'sprint_id',
    'status',
    'user_id',
    'next_task_id',
])]
class Task extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'started_at' => 'date',
            'deadline_at' => 'date',
            'status' => StatusEnum::class,
        ];
    }

    public function next_task(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'next_task_id');
    }

    public function previous_task(): HasOne
    {
        return $this->hasOne(Task::class, 'next_task_id');
    }

    public function sprint(): BelongsTo
    {
        return $this->belongsTo(Sprint::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
