<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;

class UserController extends Controller
{
    public function profile() {
        return response()->json(new UserResource(auth()->user()));
    }
}
