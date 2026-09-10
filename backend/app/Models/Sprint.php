<?php

namespace App\Models;

use App\Enums\StatusEnum;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'name',
    'description',
    'started_at',
    'deadline_at',
    'status',
    'project_id',
])]
class Sprint extends Model
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

    public function predecessors(): BelongsToMany
    {
        return $this->belongsToMany(Sprint::class, 'sprint_dependencies', 'successor_sprint_id', 'predecessor_sprint_id');
    }

    public function successors(): BelongsToMany
    {
        return $this->belongsToMany(Sprint::class, 'sprint_dependencies', 'predecessor_sprint_id', 'successor_sprint_id');
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}
