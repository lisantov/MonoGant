<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SprintController;
use App\Http\Controllers\TaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/hi', [AuthController::class, 'index']);

// Auth
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Projects
Route::group(['prefix' => '/projects/', 'middleware' => 'auth:sanctum'], function () {
    Route::post('/', [ProjectController::class, 'create'])->middleware('auth:sanctum');
    Route::get('/', [ProjectController::class, 'index'])->middleware('auth:sanctum');
    Route::patch('/{project}', [ProjectController::class, 'update'])->middleware('auth:sanctum')
        ->where(['id' => '[0-9]+']);
    Route::delete('/{project}', [ProjectController::class, 'destroy'])->middleware('auth:sanctum')
        ->where(['id' => '[0-9]+']);
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
    Route::post('/{sprint}/dependencies', [SprintController::class, 'linkDependency']);
    Route::delete('/{sprint}/dependencies', [SprintController::class, 'unlinkDependency']);
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
    Route::post('/{task}/dependencies', [TaskController::class, 'linkDependency']);
    Route::delete('/{task}/dependencies', [TaskController::class, 'unlinkDependency']);
});
