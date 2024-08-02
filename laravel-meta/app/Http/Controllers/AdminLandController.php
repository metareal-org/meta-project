<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Auction;
use App\Models\Land;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminLandController extends Controller
{
    public function index()
    {
        $lands = Land::with('owner')->paginate(20);
        return response()->json($lands);
    }

    public function update(Request $request, $id)
    {
        $land = Land::findOrFail($id);
        
        $validatedData = $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'fixed_price' => 'nullable|numeric',
            'is_for_sale' => 'boolean',
        ]);

        $land->update($validatedData);

        return response()->json(['message' => 'Land updated successfully', 'land' => $land]);
    }

    public function destroy($id)
    {
        $land = Land::findOrFail($id);
        $land->delete();

        return response()->json(['message' => 'Land deleted successfully']);
    }

    public function bulkUpdateFixedPrice(Request $request)
    {
        $validatedData = $request->validate([
            'landIds' => 'required|array',
            'landIds.*' => 'integer',
            'fixedPrice' => 'required|numeric',
        ]);

        DB::beginTransaction();

        try {
            $lands = Land::whereIn('id', $validatedData['landIds'])->get();

            foreach ($lands as $land) {
                $land->fixed_price = $validatedData['fixedPrice'];
                $land->is_for_sale = true;
                $land->save();
            }

            DB::commit();
            return response()->json(['message' => 'Lands updated successfully with fixed price']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to update lands: ' . $e->getMessage()], 500);
        }
    }

    public function bulkUpdatePriceBySize(Request $request)
    {
        $validatedData = $request->validate([
            'landIds' => 'required|array',
            'landIds.*' => 'integer',
            'pricePerSize' => 'required|numeric',
        ]);

        DB::beginTransaction();

        try {
            $lands = Land::whereIn('id', $validatedData['landIds'])->get();

            foreach ($lands as $land) {
                $land->fixed_price = $land->size * $validatedData['pricePerSize'];
                $land->is_for_sale = true;
                $land->save();
            }

            DB::commit();
            return response()->json(['message' => 'Lands updated successfully with price by size']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to update lands: ' . $e->getMessage()], 500);
        }
    }


    public function bulkCreateAuctions(Request $request)
    {
        $validatedData = $request->validate([
            'landIds' => 'required|array',
            'landIds.*' => 'integer',
            'minimumPrice' => 'required|numeric',
            'startTime' => 'required|date',
            'endTime' => 'required|date|after:startTime',
        ]);

        DB::beginTransaction();

        try {
            $lands = Land::whereIn('id', $validatedData['landIds'])->get();

            foreach ($lands as $land) {
                Auction::create([
                    'land_id' => $land->id,
                    'owner_id' => $land->owner_id,
                    'minimum_price' => $validatedData['minimumPrice'],
                    'start_time' => $validatedData['startTime'],
                    'end_time' => $validatedData['endTime'],
                    'status' => 'active',
                ]);
            }

            DB::commit();
            return response()->json(['message' => 'Auctions created successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create auctions: ' . $e->getMessage()], 500);
        }
    }

    public function bulkCancelAuctions(Request $request)
    {
        $validatedData = $request->validate([
            'auctionIds' => 'required|array',
            'auctionIds.*' => 'integer',
        ]);

        DB::beginTransaction();

        try {
            Auction::whereIn('id', $validatedData['auctionIds'])
                   ->update(['status' => 'canceled']);

            DB::commit();
            return response()->json(['message' => 'Auctions canceled successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to cancel auctions: ' . $e->getMessage()], 500);
        }
    }

    public function getAuctions()
    {
        $auctions = Auction::with('land')->paginate(20);
        return response()->json($auctions);
    }

}