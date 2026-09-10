<?php

namespace App\Models;

use App\Enums\RoleEnum;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ProjectUser extends Pivot
{
    protected function casts(): array
    {
        return [
            'role' => RoleEnum::class,
        ];
    }
}
