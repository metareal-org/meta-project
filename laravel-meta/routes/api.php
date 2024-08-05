<?php

use App\Http\Controllers\AdminLandController;
use App\Http\Controllers\AdminScratchBoxController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\AssetListingController;
use App\Http\Controllers\AssetTradeController;
use App\Http\Controllers\AuctionController;
use App\Http\Controllers\CurrencyController;
use App\Http\Controllers\LandController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\QuestController;
use App\Http\Controllers\RewardController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LandImportController;
use App\Http\Controllers\ScratchBoxController;
use Illuminate\Support\Facades\Route;

//AUTH
Route::prefix('user')->group(function () {
    Route::post('authenticate', [UserController::class, 'authenticate']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('show', [UserController::class, 'show']);
        Route::post('update', [UserController::class, 'update']);
        Route::post('logout', [UserController::class, 'logout']);
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
Route::get('/auctions/process', [AuctionController::class, 'processAuction']);
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

// Currency
Route::prefix('currency')->group(function () {
    Route::get('{userId}/{type}', [CurrencyController::class, 'getBalance']);
    Route::post('lock', [CurrencyController::class, 'lock']);
    Route::post('unlock', [CurrencyController::class, 'unlock']);
    Route::post('add', [CurrencyController::class, 'add']);
    Route::post('subtract', [CurrencyController::class, 'subtract']);
});

// Quests
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/quests', [QuestController::class, 'index']);
    Route::get('/quests/{quest}', [QuestController::class, 'show']);
    Route::post('/quests', [QuestController::class, 'store']);
    Route::put('/quests/{quest}', [QuestController::class, 'update']);
    Route::delete('/quests/{quest}', [QuestController::class, 'destroy']);
    Route::post('/quests/complete', [QuestController::class, 'complete']);
    Route::get('/user/quests', [QuestController::class, 'userQuests']);
    Route::get('/user/available-quests', [QuestController::class, 'availableQuests']);
});



//LANDS
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/lands', [LandController::class, 'index']);
    Route::get('/lands/all', [LandController::class, 'all']);
    Route::get('/lands/user', [LandController::class, 'getUserLands']);
    Route::get('/lands/{id}', [LandController::class, 'show']);
    Route::post('/lands/{id}/set-price', [LandController::class, 'setPrice']);
    Route::post('/lands/{id}/update-price', [LandController::class, 'updatePrice']);
    Route::post('/lands/{id}/cancel-sell', [LandController::class, 'cancelSell']);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/marketplace/lands', [LandController::class, 'getMarketplaceLands']);
});

//LAND-AUCTIONS
Route::post('/lands/{id}/get-active-auction', [LandController::class, 'getLandActiveAuction']);

// ADMIN-LAND-VERSION
Route::post('/admin/lands/import', [LandImportController::class, 'import']);
Route::get('/admin/lands/versions', [LandImportController::class, 'getVersions']);
Route::post('/admin/lands/revert/{id}', [LandImportController::class, 'revertToVersion']);
Route::post('/admin/lands/toggle-active/{id}', [LandImportController::class, 'toggleActive']);
Route::get('/admin/lands/versions/{id}', [LandImportController::class, 'getVersion']);
Route::post('/admin/lands/update-active-versions', [LandImportController::class, 'updateActiveVersions']);
Route::delete('/admin/lands/versions/{id}', [LandImportController::class, 'deleteVersion']);
Route::post('/admin/lands/lock/{id}', [LandImportController::class, 'lockLands']);
Route::post('/admin/lands/unlock/{id}', [LandImportController::class, 'unlockLands']);

// });

// ADMIN-LAND-MANAGE
Route::prefix('admin/manage')->group(function () {
    Route::get('/lands', [AdminLandController::class, 'index']);
    Route::put('/lands/{id}', [AdminLandController::class, 'update']);
    Route::get('/lands/all-ids', [AdminLandController::class, 'getAllLandIds']);
    Route::post('/lands/bulk-update-fixed-price', [AdminLandController::class, 'bulkUpdateFixedPrice']);
    Route::post('/lands/bulk-update-price-by-size', [AdminLandController::class, 'bulkUpdatePriceBySize']);
    Route::post('/lands/bulk-create-auctions', [AdminLandController::class, 'bulkCreateAuctions']);
    Route::post('/lands/bulk-cancel-auctions', [AdminLandController::class, 'bulkCancelAuctions']);
    Route::post('/lands/bulk-remove-auctions', [AdminLandController::class, 'bulkRemoveAuctions']);
    Route::get('/auctions', [AdminLandController::class, 'getAuctions']);
    Route::delete('/lands/{id}', [AdminLandController::class, 'destroy']);
});

// ADMIN-SCRATCH-BOXES
Route::prefix('admin/scratch-boxes')->group(function () {
    Route::get('/', [AdminScratchBoxController::class, 'index']);
    Route::post('/', [AdminScratchBoxController::class, 'create']);
    Route::delete('/{id}', [AdminScratchBoxController::class, 'destroy']);
    Route::get('/all-available-land-ids', [AdminScratchBoxController::class, 'getAllAvailableLandIds']);
    Route::get('/available-lands', [AdminScratchBoxController::class, 'getAvailableLands']);
});

// SCRATCH-BOXES
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/scratch-boxes', [ScratchBoxController::class, 'index']);
    Route::get('/scratch-boxes/available', [ScratchBoxController::class, 'available']);
    Route::get('/scratch-boxes/owned', [ScratchBoxController::class, 'owned']);
    Route::post('/scratch-boxes/{id}/buy', [ScratchBoxController::class, 'buy']);
    Route::post('/scratch-boxes/{id}/open', [ScratchBoxController::class, 'open']);
});


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/asset-listings', [AssetListingController::class, 'index']);
    Route::post('/asset-listings', [AssetListingController::class, 'create']);
    Route::put('/asset-listings/{listing}', [AssetListingController::class, 'update']);
    Route::delete('/asset-listings/{listing}', [AssetListingController::class, 'destroy']);
    Route::post('/asset-listings/{listing}/buy', [AssetListingController::class, 'buy']);
});