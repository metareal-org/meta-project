<?php

use App\Http\Controllers\LandController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


//AUTH
Route::prefix('user')->group(function () {
    Route::post('authenticate', [UserController::class, 'authenticate']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/show', [UserController::class, 'show']);
        Route::post('/update', [UserController::class, 'update']);
        Route::post('logout', [UserController::class, 'logout']);
    });
});

//LANDS
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/lands', [LandController::class, 'index']);
    Route::get('/lands/user', [LandController::class, 'getUserLands']);
    Route::get('/lands/{id}', [LandController::class, 'show']);
    Route::post('/lands/{id}/set-price', [LandController::class, 'setPrice']);
    Route::post('/lands/{id}/update-price', [LandController::class, 'updatePrice']);
    Route::post('/lands/{id}/cancel-sell', [LandController::class, 'cancelSell']);
});
//OFFERS
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/offers/{landId}', [OfferController::class, 'getOffersByLand']);
    Route::post('/offers/submit', [OfferController::class, 'submitOffer']);
    Route::post('/offers/delete/{offerId}', [OfferController::class, 'deleteOffer']);
    Route::post('/offers/update/{offerId}', [OfferController::class, 'updateOffer']);
    Route::post('/offers/user', [OfferController::class, 'getOffersByUser']);
});
