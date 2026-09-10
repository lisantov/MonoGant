<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProjectResource;
use App\Http\Resources\UserResource;

class UserController extends Controller
{
    public function profile() {
        $user = auth()->user()->load('projects');
        return response()->json([
            'user' => new UserResource($user),
            'projects' => ProjectResource::collection($user->projects),
        ]);
    }
}
