<?php

namespace App\Http\Controllers;

use App\Models\Auction;
use App\Models\AuctionBid;
use App\Models\Land;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

class AuctionController extends Controller
{
    public function createAuction(Request $request): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'land_id' => 'required|exists:lands,id',
                'minimum_price' => 'required|integer|min:10',
                'duration' => 'required|integer|min:10',
            ]);

            $land = Land::findOrFail($validatedData['land_id']);

            if ($land->owner_id !== Auth::id()) {
                return response()->json([
                    'error' => 'Authorization Error',
                    'message' => 'You are not the owner of this land',
                    'land_id' => $validatedData['land_id'],
                    'owner_id' => $land->owner_id,
                    'user_id' => Auth::id()
                ], 403);
            }

            if ($land->fixed_price > 0) {
                return response()->json([
                    'error' => 'Invalid Operation',
                    'message' => 'Land with fixed price cannot be auctioned',
                    'land_id' => $validatedData['land_id'],
                    'fixed_price' => $land->fixed_price
                ], 400);
            }

            if ($land->activeAuction()) {
                return response()->json([
                    'error' => 'Conflict',
                    'message' => 'An active auction already exists for this land',
                    'land_id' => $validatedData['land_id'],
                    'existing_auction' => $land->activeAuction()
                ], 409);
            }

            $startTime = Carbon::now();
            $endTime = $startTime->copy()->addHours($validatedData['duration']);

            $auction = new Auction([
                'land_id' => $land->id,
                'owner_id' => Auth::id(),
                'minimum_price' => $validatedData['minimum_price'],
                'start_time' => $startTime,
                'end_time' => $endTime,
            ]);

            $auction->save();

            return response()->json(['message' => 'Auction created successfully', 'auction' => $auction], 201);
        } catch (ValidationException $e) {
            return response()->json(['error' => 'Validation failed', 'details' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Internal Server Error',
                'message' => 'Failed to create auction',
                'exception' => $e->getMessage(),
                'input' => $request->all()
            ], 500);
        }
    }
    public function getActiveAuctionForLand($landId): JsonResponse
    {
        try {
            $activeAuctions = Auction::where('land_id', $landId)
                ->where('end_time', '>', now())
                ->with(['bids', 'land:id'])
                ->get();

            if ($activeAuctions->count() > 1) {
                return response()->json([
                    'error' => 'Data Integrity Error',
                    'message' => 'Multiple active auctions found for this land',
                    'land_id' => $landId
                ], 500);
            }

            $activeAuction = $activeAuctions->first();

            if (!$activeAuction) {
                return response()->json([
                    'message' => 'No active auction found for this land',
                    'land_id' => $landId
                ], 404);
            }

            return response()->json($activeAuction);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Internal Server Error',
                'message' => 'Failed to get active auction for land',
                'exception' => $e->getMessage(),
                'land_id' => $landId
            ], 500);
        }
    }

    public function getAllLandAuctions($landId): JsonResponse
    {
        try {
            $auctions = Auction::where('land_id', $landId)
                ->orderBy('start_time', 'desc')
                ->get();

            if ($auctions->isEmpty()) {
                return response()->json([
                    'message' => 'No auctions found for this land',
                    'land_id' => $landId
                ], 404);
            }

            return response()->json($auctions);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Internal Server Error',
                'message' => 'Failed to get all auctions for land',
                'exception' => $e->getMessage(),
                'land_id' => $landId
            ], 500);
        }
    }
    public function placeBid(Request $request, $auctionId): JsonResponse
    {
        DB::beginTransaction();
        try {
            $validatedData = $request->validate([
                'amount' => 'required|integer|min:1',
            ]);

            $auction = Auction::findOrFail($auctionId);
            $user = User::findOrFail(Auth::id());

            if (!$auction->isActive()) {
                throw new \Exception('Auction is not active');
            }

            if ($auction->owner_id === $user->id) {
                throw new \Exception('Auction owner cannot place a bid');
            }

            $highestBid = $auction->highestBid();
            $minBidAmount = $highestBid
                ? $highestBid->amount * 1.05
                : $auction->minimum_price;

            if ($validatedData['amount'] < $minBidAmount) {
                throw new \Exception('Bid amount is too low');
            }

            if (!$user->lockCp($validatedData['amount'])) {
                throw new \Exception('Insufficient CP to place bid');
            }

            $bid = new AuctionBid([
                'auction_id' => $auction->id,
                'user_id' => $user->id,
                'amount' => $validatedData['amount'],
            ]);
            $bid->save();

            $auction->extendEndTime();

            if ($highestBid) {
                $highestBid->user->unlockCp($highestBid->amount);
            }

            DB::commit();
            return response()->json(['message' => 'Bid placed successfully', 'bid' => $bid], 201);
        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json(['error' => 'Validation failed', 'details' => $e->errors()], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            if (isset($user) && isset($validatedData['amount'])) {
                $user->unlockCp($validatedData['amount']);
            }
            return response()->json([
                'error' => 'Bid Placement Failed',
                'message' => $e->getMessage(),
                'auction_id' => $auctionId,
                'input' => $request->all()
            ], 400);
        }
    }

    public function getBidsForAuction($auctionId): JsonResponse
    {
        try {
            $bids = AuctionBid::where('auction_id', $auctionId)
                ->with('user:id,nickname')
                ->orderBy('amount', 'desc')
                ->get();
            return response()->json($bids);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Internal Server Error',
                'message' => 'Failed to retrieve bids',
                'exception' => $e->getMessage(),
                'auction_id' => $auctionId
            ], 500);
        }
    }
}
