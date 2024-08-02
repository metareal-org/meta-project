<?php

namespace App\Http\Controllers;

use App\Models\Auction;
use App\Models\AuctionBid;
use App\Models\Bid;
use App\Models\Land;
use App\Models\Transaction;
use App\Models\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AuctionController extends Controller
{
    public function createAuction(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'land_id' => 'required|exists:lands,id',
            'minimum_price' => 'required|integer|min:100',
            'duration' => 'required|integer|min:1',
        ]);

        $land = Land::findOrFail($validatedData['land_id']);

        if ($land->owner_id !== Auth::id()) {
            return response()->json(['error' => 'You do not own this land'], 403);
        }

        if ($land->is_for_sale || $land->fixed_price > 0 || $land->auctions()->where('is_active', true)->exists()) {
            return response()->json(['error' => 'Land is not eligible for auction'], 400);
        }

        $endTime = now()->addHours($validatedData['duration']);

        $auction = new Auction([
            'land_id' => $validatedData['land_id'],
            'minimum_price' => $validatedData['minimum_price'],
            'end_time' => $endTime,
            'start_time' => now(),
            'owner_id' => $land->owner_id,
        ]);

        $land->auctions()->save($auction);

        return response()->json(['message' => 'Auction created successfully', 'auction' => $auction], 201);
    }

    public function placeBid(Request $request, $auctionId): JsonResponse
    {
        $validatedData = $request->validate([
            'amount' => 'required|integer|min:100',
        ]);

        $auction = Auction::findOrFail($auctionId);
        $user = User::find(Auth::user()->id);

        if (!$auction->is_active || $auction->end_time->isPast()) {
            return response()->json(['error' => 'Auction is not active'], 400);
        }

        if ($auction->land->owner_id === $user->id) {
            return response()->json(['error' => 'You cannot bid on your own auction'], 403);
        }

        $minBidAmount = $auction->highest_bid
            ? $auction->highest_bid * 1.05
            : max($auction->minimum_price, $auction->highest_bid ?? 0);

        if ($validatedData['amount'] < $minBidAmount) {
            return response()->json(['error' => 'Bid amount is too low'], 400);
        }

        DB::beginTransaction();
        try {
            // Check if the user already has a bid on this auction
            $existingBid = $auction->bids()->where('user_id', $user->id)->orderBy('amount', 'desc')->first();

            if ($existingBid) {
                // Unlock the previous bid amount
                if (!$user->unlockCp($existingBid->amount)) {
                    throw new \Exception('Failed to unlock previous bid amount');
                }
            }

            // Lock the new bid amount
            if (!$user->lockCp($validatedData['amount'])) {
                throw new \Exception('Insufficient CP to place bid');
            }

            $bid = new AuctionBid([
                'auction_id' => $auction->id,
                'user_id' => $user->id,
                'amount' => $validatedData['amount'],
            ]);
            $bid->save();

            $previousHighestBid = $auction->highestBid();
            if ($previousHighestBid && $previousHighestBid->user_id !== $user->id) {
                $previousHighestBid->user->unlockCp($previousHighestBid->amount);
            }

            DB::commit();
            return response()->json(['message' => 'Bid placed successfully', 'bid' => $bid], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            if (isset($existingBid)) {
                $user->lockCp($existingBid->amount);
            }
            if (isset($validatedData['amount'])) {
                $user->unlockCp($validatedData['amount']);
            }
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function processAuction2(): JsonResponse
    {
        $endedAuctions = Auction::where('status', 'active')
            ->where('end_time', '<=', now())
            ->with(['land', 'bids.user'])
            ->get();

        $processedCount = 0;

        foreach ($endedAuctions as $auction) {
            DB::beginTransaction();
            try {
                // Update auction status
                $auction->status = 'completed';
                $auction->save();

                $highestBid = $auction->bids()->orderBy('amount', 'desc')->first();
                if ($highestBid) {
                    $land = $auction->land;
                    $seller = User::findOrFail($auction->owner_id);
                    $buyer = $highestBid->user;

                    // Transfer land ownership
                    $land->owner_id = $buyer->id;
                    $land->is_for_sale = false;
                    $land->fixed_price = 0;
                    $land->save();

                    // Transfer CP
                    if (!$seller->addCp($highestBid->amount)) {
                        throw new \Exception("Failed to add CP to seller");
                    }
                    if (!$buyer->removeCp($highestBid->amount)) {
                        throw new \Exception("Failed to remove CP from buyer");
                    }

                    // Create transaction record
                    Transaction::create([
                        'land_id' => $land->id,
                        'seller_id' => $seller->id,
                        'buyer_id' => $buyer->id,
                        'price' => $highestBid->amount,
                    ]);

                    // Unlock CP for other bidders
                    $otherBids = $auction->bids()->where('user_id', '!=', $buyer->id)->get();
                    foreach ($otherBids as $bid) {
                        if (!$bid->user->unlockCp($bid->amount)) {
                            throw new \Exception("Failed to unlock CP for user {$bid->user_id}");
                        }
                    }
                } else {
                    // No bids, just update the land
                    $land = $auction->land;
                    $land->is_for_sale = false;
                    $land->fixed_price = 0;
                    $land->save();
                }

                DB::commit();
                $processedCount++;
            } catch (\Exception $e) {
                DB::rollBack();
                Log::error('Error processing auction ' . $auction->id . ': ' . $e->getMessage());
            }
        }

        return response()->json([
            'message' => 'Auctions processed successfully',
            'processed_count' => $processedCount
        ]);
    }
    public function processAuction(): JsonResponse
    {
        $endedAuctions = Auction::where('status', 'active')
            ->where('end_time', '<=', now())
            ->with(['land', 'bids.user'])
            ->get();
    
        $processedCount = 0;
    
        foreach ($endedAuctions as $auction) {
            DB::beginTransaction();
            try {
                // Update auction status
                $auction->status = 'done';
                $auction->save();
    
                $highestBid = $auction->bids()->orderBy('amount', 'desc')->first();
                if ($highestBid) {
                    $land = $auction->land;
                    $seller = User::findOrFail($auction->owner_id);
                    $buyer = $highestBid->user;
    
                    // Transfer land ownership
                    $land->owner_id = $buyer->id;
                    $land->is_for_sale = false;
                    $land->fixed_price = 0;
                    $land->save();
    
                    // Transfer CP
                    if (!$seller->addCp($highestBid->amount)) {
                        throw new \Exception("Failed to add CP to seller");
                    }
                    if (!$buyer->removeCp($highestBid->amount)) {
                        throw new \Exception("Failed to remove CP from buyer");
                    }
    
                    // Create transaction record
                    Transaction::create([
                        'land_id' => $land->id,
                        'seller_id' => $seller->id,
                        'buyer_id' => $buyer->id,
                        'price' => $highestBid->amount,
                    ]);
    
                    // Unlock CP for other bidders
                    $otherBids = $auction->bids()->where('user_id', '!=', $buyer->id)->get();
                    foreach ($otherBids as $bid) {
                        if (!$bid->user->unlockCp($bid->amount)) {
                            throw new \Exception("Failed to unlock CP for user {$bid->user_id}");
                        }
                    }
                } else {
                    // No bids, just update the land
                    $land = $auction->land;
                    $land->is_for_sale = false;
                    $land->fixed_price = 0;
                    $land->save();
                }
    
                DB::commit();
                $processedCount++;
    
                // Log successful processing
                Log::info("Auction {$auction->id} processed successfully. Status: " . ($highestBid ? "Sold" : "No bids"));
    
            } catch (Exception $e) {
                DB::rollBack();
                Log::error("Error processing auction {$auction->id}: " . $e->getMessage());
            }
        }
    
        // Process any canceled auctions
        $canceledAuctions = Auction::where('status', 'canceled')
            ->where('end_time', '<=', now())
            ->with('land')
            ->get();
    
        foreach ($canceledAuctions as $canceledAuction) {
            DB::beginTransaction();
            try {
                $land = $canceledAuction->land;
                $land->is_for_sale = false;
                $land->fixed_price = 0;
                $land->save();
    
                $canceledAuction->status = 'done';
                $canceledAuction->save();
    
                DB::commit();
                $processedCount++;
    
                Log::info("Canceled auction {$canceledAuction->id} processed successfully.");
            } catch (Exception $e) {
                DB::rollBack();
                Log::error("Error processing canceled auction {$canceledAuction->id}: " . $e->getMessage());
            }
        }
    
        return response()->json([
            'message' => 'Auctions processed successfully',
            'processed_count' => $processedCount,
            'ended_auctions_count' => $endedAuctions->count(),
            'canceled_auctions_count' => $canceledAuctions->count(),
        ]);
    }

    public function cancelAuction(Request $request, $auctionId): JsonResponse
    {
        $auction = Auction::findOrFail($auctionId);
        $user = Auth::user();

        if ($auction->owner_id !== $user->id) {
            return response()->json(['error' => 'You are not the owner of this auction'], 403);
        }

        if ($auction->status !== 'active') {
            return response()->json(['error' => 'This auction is not active'], 400);
        }

        if ($auction->bids()->count() > 0) {
            return response()->json(['error' => 'Cannot cancel auction with existing bids'], 400);
        }

        DB::beginTransaction();
        try {
            $auction->status = 'canceled';
            $auction->save();

            $land = $auction->land;
            $land->is_for_sale = false;
            $land->fixed_price = 0;
            $land->save();

            DB::commit();
            return response()->json(['message' => 'Auction canceled successfully'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to cancel auction: ' . $e->getMessage()], 500);
        }
    }
}
