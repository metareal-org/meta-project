<?php

namespace App\Http\Controllers;

use App\Models\Auction;
use App\Models\Land;
use App\Models\Offer;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TransactionController extends Controller
{
    public function acceptOffer($offerId): JsonResponse
    {
        $offer = Offer::findOrFail($offerId);
        $land = $offer->land;
        $buyer = $offer->user;
        $seller = User::findOrFail($land->owner_id);

        if (Auth::id() !== $seller->id) {
            return response()->json(['error' => 'You are not authorized to accept this offer.'], 403);
        }
        if ($buyer->id === $seller->id) {
            return response()->json(['error' => 'You cannot accept your own offer.'], 400);
        }
        try {
            DB::transaction(function () use ($land, $buyer, $seller, $offer) {
                // Transfer ownership
                $land->update([
                    'owner_id' => $buyer->id,
                    'fixed_price' => 0,
                ]);

                // Transfer Bnb
                $buyer->unlockBnb($offer->price);
                $buyer->RemoveBnb($offer->price);
                $seller->addBnb($offer->price);

                // Create transaction record
                Transaction::create([
                    'land_id' => $land->id,
                    'seller_id' => $seller->id,
                    'buyer_id' => $buyer->id,
                    'price' => $offer->price,
                ]);

                // Mark offer as accepted
                $offer->update(['is_accepted' => true]);

                // Cancel all other offers for this land
                $land->offers()->where('id', '!=', $offer->id)->get()->each(function ($otherOffer) {
                    $otherOffer->user->unlockBnb($otherOffer->price);
                    $otherOffer->delete();
                });
            });

            return response()->json([
                'message' => 'Offer accepted successfully.',
                'land' => $land->fresh()->load('owner'),
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function buyLand(Request $request, $landId)
    {
        $land = Land::findOrFail($landId);
        $buyer = User::find(Auth::user()->id);
        $seller = User::findOrFail($land->owner_id);

        if (!$land->is_for_sale) {
            return response()->json(['message' => 'This land is not for sale.'], 400);
        }

        if ($land->owner_id === $buyer->id) {
            return response()->json(['message' => 'You cannot buy your own land.'], 400);
        }

        if (!$buyer->hasSufficientBnb($land->fixed_price)) {
            return response()->json(['message' => 'Insufficient Bnb to purchase this land.'], 400);
        }

        try {
            DB::transaction(function () use ($land, $buyer, $seller) {
                $buyer->removeBnb($land->fixed_price);
                $seller->addBnb($land->fixed_price);

                $land->update([
                    'owner_id' => $buyer->id,
                    'fixed_price' => 0,
                ]);

                Transaction::create([
                    'land_id' => $land->id,
                    'seller_id' => $seller->id,
                    'buyer_id' => $buyer->id,
                    'price' => $land->fixed_price,
                ]);

                // Cancel buyer's offers for this land and unlock their Bnb
                $buyer->offers()->where('land_id', $land->id)->get()->each(function ($offer) {
                    $offer->delete(); // This will trigger the deleted event in the Offer model, which unlocks the Bnb
                });

                // Cancel all other offers for this land
                $land->offers()->where('user_id', '!=', $buyer->id)->delete();
            });

            return response()->json([
                'message' => 'Land purchased successfully.',
                'land' => $land->fresh()->load('owner'),
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

}
