<?php

namespace App\Http\Controllers;

use App\Models\Land;
use App\Models\Offer;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

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

        // Remove the check for is_for_sale

        try {
            DB::transaction(function () use ($land, $buyer, $seller, $offer) {
                // Transfer ownership
                $land->update([
                    'owner_id' => $buyer->id,
                    'is_for_sale' => false,
                    'fixed_price' => null,
                ]);

                // Transfer CP
                $buyer->unlockCp($offer->price);
                $seller->addCp($offer->price);

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
                    $otherOffer->user->unlockCp($otherOffer->price);
                    $otherOffer->delete();
                });
            });

            return response()->json([
                'message' => 'Offer accepted successfully.',
                'land' => $land->fresh()->load('owner'),
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred during the transaction: ' . $e->getMessage()], 500);
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

        if (!$buyer->hasSufficientCp($land->fixed_price)) {
            return response()->json(['message' => 'Insufficient CP to purchase this land.'], 400);
        }

        try {
            DB::transaction(function () use ($land, $buyer, $seller) {
                $buyer->removeCp($land->fixed_price);
                $seller->addCp($land->fixed_price);

                $land->update([
                    'owner_id' => $buyer->id,
                    'is_for_sale' => false,
                ]);

                Transaction::create([
                    'land_id' => $land->id,
                    'seller_id' => $seller->id,
                    'buyer_id' => $buyer->id,
                    'price' => $land->fixed_price,
                ]);

                // Cancel all existing offers for this land
                $land->offers()->delete();
            });

            return response()->json([
                'message' => 'Land purchased successfully.',
                'land' => $land->fresh()->load('owner'),
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred during the transaction.'], 500);
        }
    }
}
