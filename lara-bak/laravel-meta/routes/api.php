<?php

use App\Http\Controllers\AssetController;
use App\Http\Controllers\AuctionController;
use App\Http\Controllers\LandController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\RewardController;
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
        Route::post('apply-referral', [UserController::class, 'applyReferral']);
        Route::get('referral-tree', [UserController::class, 'getReferralTree']);
        Route::get('referral-code', [UserController::class, 'getReferralCode']);
    });
});
//ASSETS
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/assets', [AssetController::class, 'index']);
    Route::post('/assets/update', [AssetController::class, 'update']);
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
Route::get('/auctions/process ', [AuctionController::class, 'processAuction']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auctions/create', [AuctionController::class, 'createAuction']);
    Route::post('/auctions/{auctionId}/bid', [AuctionController::class, 'placeBid']);
    Route::get('/auctions/{auctionId}/bids', [AuctionController::class, 'getBidsForAuction']);
    Route::post('/auctions/{auctionId}/cancel', [AuctionController::class, 'cancelAuction']);
});



// Rewards
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/rewards', [RewardController::class, 'index']);
    Route::get('/rewards/{id}', [RewardController::class, 'show']);
    Route::post('/rewards/claim/{id}', [RewardController::class, 'claim']);
    Route::get('/user/rewards', [RewardController::class, 'userRewards']);
});