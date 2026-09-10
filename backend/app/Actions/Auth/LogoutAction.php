<?php

namespace App\Actions\Auth;

use App\Models\User;
use Lorisleiva\Actions\Concerns\AsAction;

class LogoutAction
{
    use AsAction;

    public function handle(User $user): bool
    {
        return $user->currentAccessToken()->delete();
    }
}
