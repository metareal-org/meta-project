<?php

namespace App\Http\Controllers;

use App\Models\Land;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
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
