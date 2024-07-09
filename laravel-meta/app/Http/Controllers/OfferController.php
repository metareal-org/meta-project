<?php

namespace App\Http\Controllers;

use App\Models\Land;
use App\Models\Offer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class OfferController extends Controller
{
    public function getOffersByLand(Request $request, $landId): JsonResponse
    {
        $user = Auth::user();
        $land = Land::findOrFail($landId);

        $offers = Offer::where('land_id', $landId)
            ->with('user:id,nickname')
            ->select('id', 'user_id', 'price', 'created_at')
            ->orderBy('price', 'desc')
            ->get();

        $highestOffer = $offers->first();
        $userOffer = $offers->firstWhere('user_id', $user->id);

        $formattedOffers = $offers->map(function ($offer) {
            return [
                'id' => $offer->id,
                'offer' => $offer->price,
                'user' => $offer->user->nickname ?? 'Unknown',
                'date' => $offer->created_at->timestamp * 1000, // Convert to milliseconds for JS
            ];
        });

        return response()->json([
            'offers' => $formattedOffers,
            'highestOffer' => $highestOffer ? $highestOffer->price : null,
            'userOffer' => $userOffer ? [
                'id' => $userOffer->id,
                'offer' => $userOffer->price,
                'date' => $userOffer->created_at->timestamp * 1000,
            ] : null,
            'landOwner' => $land->owner_id,
        ]);
    }

    public function submitOffer(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'land_id' => 'required|exists:lands,id',
            'price' => 'required|numeric|min:0',
        ]);

        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $offer = new Offer();
        $offer->land_id = $validatedData['land_id'];
        $offer->user_id = $user->id;
        $offer->price = $validatedData['price'];
        $offer->save();

        return response()->json([
            'message' => 'Offer submitted successfully',
            'offer' => [
                'id' => $offer->id,
                'offer' => $offer->price,
                'user' => $user->nickname ?? 'Unknown',
                'date' => $offer->created_at->timestamp * 1000,
            ]
        ], 201);
    }

    public function deleteOffer(Request $request, $offerId): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $offer = Offer::findOrFail($offerId);

        if ($offer->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $offer->delete();

        return response()->json(['message' => 'Offer deleted successfully']);
    }

    public function updateOffer(Request $request, $offerId): JsonResponse
    {
        $validatedData = $request->validate([
            'price' => 'required|numeric|min:0',
        ]);

        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $offer = Offer::findOrFail($offerId);

        if ($offer->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $offer->price = $validatedData['price'];
        $offer->save();

        return response()->json([
            'message' => 'Offer updated successfully',
            'offer' => [
                'id' => $offer->id,
                'offer' => $offer->price,
                'user' => $user->nickname ?? 'Unknown',
                'date' => $offer->updated_at->timestamp * 1000,
            ]
        ]);
    }

    public function getOffersByUser()
    {
        $user = Auth::user();
        $offers = Offer::where('user_id', $user->id)
            ->with('land:id,region,center_point')
            ->get();

        return response()->json($offers);
    }
}
