<?php

namespace App\Models\Status;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name'])]
class Status extends Model
{
    public function projects(): HasMany
    {
        return $this->hasMany(\App\Models\Project::class);
    }
}
