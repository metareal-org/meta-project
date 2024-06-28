<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;



Route::prefix('user')->group(function () {
    Route::post('authenticate', [UserController::class, 'authenticate']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/show', [UserController::class, 'show']);
        Route::post('/update', [UserController::class, 'update']);
        Route::post('logout', [UserController::class, 'logout']);
    });
});
Route::get('/s', function () {
    return ('s');
});
