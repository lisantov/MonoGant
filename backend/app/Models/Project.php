<?php

namespace App\Models;

use App\Enums\RoleEnum;
use App\Enums\StatusEnum;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
}
