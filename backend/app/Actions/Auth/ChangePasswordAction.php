<?php

namespace App\Actions\Auth;

use App\Models\User;
use Lorisleiva\Actions\Concerns\AsAction;

class ChangePasswordAction
{
    use AsAction;

    public function handle(User $user, array $data): User
    {
        $user->tokens()->where('id', '!=', $user->currentAccessToken()?->id)->delete();

        $user->update(['password' => $data['new_password']]);

        return $user;
    }
}
