<?php

use App\Http\Controllers\AuctionController;
use App\Http\Controllers\LandController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


//AUTH
Route::prefix('user')->group(function () {
    Route::post('authenticate', [UserController::class, 'authenticate']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('show', [UserController::class, 'show']);
        Route::post('update', [UserController::class, 'update']);
        Route::post('logout', [UserController::class, 'logout']);
        Route::post('update-cp-amount', [UserController::class, 'updateCpAmount']);
        Route::post('update-meta-amount', [UserController::class, 'updateMetaAmount']);
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
//LAND-AUCTIONS
Route::post('/lands/{id}/get-active-auction', [LandController::class, 'getLandActiveAuction']);

//AUCTIONS
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auctions/start/{landId}', [AuctionController::class, 'startAuction']);
    Route::post('/auctions/{id}/bid', [AuctionController::class, 'placeBid']);
    Route::get('/auctions/active', [AuctionController::class, 'getActiveAuctions']);
});


//OFFERS
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/offers/{landId}', [OfferController::class, 'getOffersByLand']);
    Route::post('/offers/user', [OfferController::class, 'getOffersByUser']);
    Route::post('/offers/submit', [OfferController::class, 'submitOffer']);
    Route::post('/offers/delete/{offerId}', [OfferController::class, 'deleteOffer']);
    Route::post('/offers/update/{offerId}', [OfferController::class, 'updateOffer']);
});

//Transactions
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/lands/{id}/buy', [TransactionController::class, 'buyLand']);
    Route::post('/offers/accept/{offerId}', [TransactionController::class, 'acceptOffer']);
});

// Auctions
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auctions/create', [AuctionController::class, 'createAuction']);
    Route::get('/auctions/land/{landId}/active', [AuctionController::class, 'getActiveAuctionForLand']);
    Route::get('/auctions/land/{landId}/all', [AuctionController::class, 'getAllLandAuctions']);
    Route::post('/auctions/{auctionId}/bid', [AuctionController::class, 'placeBid']);
    Route::get('/auctions/{auctionId}/bids', [AuctionController::class, 'getBidsForAuction']);
});
