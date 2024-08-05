<?php

namespace App\Http\Controllers;

use App\Models\AssetListing;
use App\Models\Asset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AssetListingController extends Controller
{
    public function index()
    {
        $listings = AssetListing::where('is_active', true)->get();
        return response()->json(['listings' => $listings]);
    }

    public function create(Request $request)
    {
        $validatedData = $request->validate([
            'asset_type' => 'required|string|in:gift,ticket,wood,stone,sand,gold',
            'amount' => 'required|integer|min:1',
            'price_in_bnb' => 'required|numeric|min:0',
        ]);

        $user = $request->user();
        $asset = $user->assets()->where('type', $validatedData['asset_type'])->first();

        if (!$asset || $asset->amount < $validatedData['amount']) {
            return response()->json(['message' => 'Insufficient assets'], 400);
        }

        DB::beginTransaction();

        try {
            $listing = AssetListing::create([
                'user_id' => $user->id,
                'asset_type' => $validatedData['asset_type'],
                'amount' => $validatedData['amount'],
                'price_in_bnb' => $validatedData['price_in_bnb'],
            ]);

            $asset->decrement('amount', $validatedData['amount']);

            DB::commit();

            return response()->json(['message' => 'Listing created successfully', 'listing' => $listing]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create listing'], 500);
        }
    }

    public function update(Request $request, AssetListing $listing)
    {
        if ($listing->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validatedData = $request->validate([
            'price_in_bnb' => 'required|numeric|min:0',
        ]);

        $listing->update($validatedData);

        return response()->json(['message' => 'Listing updated successfully', 'listing' => $listing]);
    }

    public function destroy(AssetListing $listing)
    {
        if ($listing->user_id !== request()->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        DB::beginTransaction();

        try {
            $user = request()->user();
            $asset = $user->assets()->where('type', $listing->asset_type)->first();

            if ($asset) {
                $asset->increment('amount', $listing->amount);
            } else {
                Asset::create([
                    'user_id' => $user->id,
                    'type' => $listing->asset_type,
                    'amount' => $listing->amount,
                ]);
            }

            $listing->delete();

            DB::commit();

            return response()->json(['message' => 'Listing removed successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to remove listing'], 500);
        }
    }

    public function buy(AssetListing $listing)
    {
        $buyer = request()->user();

        if ($listing->user_id === $buyer->id) {
            return response()->json(['message' => 'You cannot buy your own listing'], 400);
        }

        $buyerBnbAsset = $buyer->assets()->where('type', 'bnb')->first();

        if (!$buyerBnbAsset || $buyerBnbAsset->amount < $listing->price_in_bnb) {
            return response()->json(['message' => 'Insufficient BNB balance'], 400);
        }

        DB::beginTransaction();

        try {
            // Transfer BNB
            $buyerBnbAsset->decrement('amount', $listing->price_in_bnb);
            $seller = $listing->user;
            $sellerBnbAsset = $seller->assets()->where('type', 'bnb')->first();
            if ($sellerBnbAsset) {
                $sellerBnbAsset->increment('amount', $listing->price_in_bnb);
            } else {
                Asset::create([
                    'user_id' => $seller->id,
                    'type' => 'bnb',
                    'amount' => $listing->price_in_bnb,
                ]);
            }

            // Transfer listed asset
            $buyerAsset = $buyer->assets()->where('type', $listing->asset_type)->first();
            if ($buyerAsset) {
                $buyerAsset->increment('amount', $listing->amount);
            } else {
                Asset::create([
                    'user_id' => $buyer->id,
                    'type' => $listing->asset_type,
                    'amount' => $listing->amount,
                ]);
            }

            $listing->delete();

            DB::commit();

            return response()->json(['message' => 'Asset purchased successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to complete the purchase'], 500);
        }
    }
}