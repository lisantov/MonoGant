<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
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
