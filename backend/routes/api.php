<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SprintController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/user', [UserController::class, 'profile'])->middleware('auth:sanctum');
Route::patch('/user', [UserController::class, 'update'])->middleware('auth:sanctum');

Route::get('/hi', [AuthController::class, 'index']);

// Auth
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/change-password', [AuthController::class, 'changePassword'])->middleware('auth:sanctum');

// Projects
Route::group(['prefix' => '/projects/', 'middleware' => 'auth:sanctum'], function () {
    Route::post('/', [ProjectController::class, 'create']);
    Route::get('/', [ProjectController::class, 'index']);
    Route::patch('/{project}', [ProjectController::class, 'update'])
        ->where(['id' => '[0-9]+']);
    Route::delete('/{project}', [ProjectController::class, 'destroy'])
        ->where(['id' => '[0-9]+']);
    Route::get('{project}', [ProjectController::class, 'show'])
        ->where(['id' => '[0-9]+']);
    Route::get('parse/{project}', [ProjectController::class, 'parse']);
    Route::post('/{project}/members', [ProjectController::class, 'storeMembers']);
    Route::post('/{project}/members/remove', [ProjectController::class, 'removeMemberByEmail']);
    Route::patch('/{project}/members/{member}', [ProjectController::class, 'setMemberRole']);
    Route::delete('/{project}/members/{member}', [ProjectController::class, 'removeMember']);
});

// Sprints
Route::group(['prefix' => '/projects/{project}/sprints', 'middleware' => 'auth:sanctum'], function () {
    Route::get('/', [SprintController::class, 'index']);
    Route::post('/', [SprintController::class, 'store']);
});

Route::group(['prefix' => '/sprints', 'middleware' => 'auth:sanctum'], function () {
    Route::get('/{sprint}', [SprintController::class, 'show']);
    Route::patch('/{sprint}', [SprintController::class, 'update']);
    Route::delete('/{sprint}', [SprintController::class, 'destroy']);
});

// Tasks
Route::group(['prefix' => '/sprints/{sprint}/tasks', 'middleware' => 'auth:sanctum'], function () {
    Route::get('/', [TaskController::class, 'index']);
    Route::post('/', [TaskController::class, 'store']);
});

Route::group(['prefix' => '/tasks', 'middleware' => 'auth:sanctum'], function () {
    Route::get('/{task}', [TaskController::class, 'show']);
    Route::patch('/{task}', [TaskController::class, 'update']);
    Route::delete('/{task}', [TaskController::class, 'destroy']);
});

// Comments
Route::group(['prefix' => '/tasks/{task}/comments', 'middleware' => 'auth:sanctum'], function () {
    Route::get('/', [CommentController::class, 'index']);
    Route::post('/', [CommentController::class, 'store']);
});

Route::group(['prefix' => '/comments', 'middleware' => 'auth:sanctum'], function () {
    Route::get('/{comment}', [CommentController::class, 'show']);
});
