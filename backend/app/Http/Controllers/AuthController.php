<?php

namespace App\Http\Controllers;

use App\Actions\Auth\LoginAction;
use App\Actions\Auth\LogoutAction;
use App\Actions\Auth\RegisterAction;
use App\Http\Requests\Auth\LoginUserRequest;
use App\Http\Requests\Auth\RegisterUserRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'message' => 'OK',
        ]);
    }

    public function login(LoginUserRequest $request): JsonResponse
    {
        $user = LoginAction::run($request->validated());

        return response()->json([
            'token' => $user->createToken('api-token')->plainTextToken,
            'user' => new UserResource($user),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        LogoutAction::run($request->user());

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }

    public function register(RegisterUserRequest $request): JsonResponse
    {
        $user = RegisterAction::run($request->validated());

        return response()->json([
            'token' => $user->createToken('api-token')->plainTextToken,
            'user' => new UserResource($user),
        ], 201);
    }
}
