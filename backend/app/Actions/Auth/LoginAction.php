<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Lorisleiva\Actions\Concerns\AsAction;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class LoginAction
{
    use AsAction;

    public function handle(array $data): User
    {
        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw new AccessDeniedHttpException();
        }

        return $user;
    }
}
