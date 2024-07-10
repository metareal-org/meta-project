<?php

namespace App\Http\Controllers;

use App\Models\Land;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LandController extends Controller
{
    private const MIN_ZOOM_LEVEL = 4; // Lowered from 5 to 4

    public function index(Request $request): JsonResponse
    {
        $bounds = $request->input('bounds');
        $zoom = $request->input('zoom');
        if (!$zoom || $zoom < self::MIN_ZOOM_LEVEL) {
            return response()->json([]);
        }
        $query = Land::with('owner:id,nickname');
        if ($bounds) {
            $query->whereBetween('latitude', [$bounds['south'], $bounds['north']])
                ->whereBetween('longitude', [$bounds['west'], $bounds['east']]);
            $limit = $this->getLimitByZoom($zoom);
            $query->limit($limit);
        }
        $lands = $query->get();
        return response()->json($lands);
    }
    public function getUserLands()
    {
        $user = Auth::user();
        $lands = Land::where('owner_id', $user->id)->get();
        return response()->json($lands);
    }
    private function getLimitByZoom(float $zoom): int
    {
        if ($zoom < 8) {
            return 400;  // Doubled from 200
        } elseif ($zoom < 12) {
            return 1500; // Doubled from 750
        } elseif ($zoom < 15) {
            return 3000; // Doubled from 1500
        } else {
            return 4000; // Doubled from 2000
        }
    }

    public function setPrice(Request $request, $id): JsonResponse
    {
        $land = Land::findOrFail($id);

        if ($land->owner_id !== Auth::id()) {
            return response()->json(['error' => 'You do not own this land'], 403);
        }
        $validatedData = $request->validate([
            'price' => 'required|numeric|min:100|max:100000000000',
        ]);
        $land->fixed_price = $validatedData['price'];
        $land->is_for_sale = true;
        $land->save();
        return response()->json([
            'message' => 'Price set successfully',
            'land' => $land
        ]);
    }

    public function show($id)
    {
        $land = Land::findOrFail($id);
        return response()->json([
            'id' => $land->id,
            'owner_id' => $land->owner_id,
            'owner_nickname' => $land->owner_nickname, 
            'is_for_sale' => $land->is_for_sale,
            'fixed_price' => $land->fixed_price,
            'center_point' => $land->center_point,
            'size' => $land->size,
            'region' => $land->region,
        ]);
    }

    public function updatePrice(Request $request, $id): JsonResponse
    {
        $land = Land::findOrFail($id);

        // Check if the authenticated user owns the land
        if ($land->owner_id !== Auth::id()) {
            return response()->json(['error' => 'You do not own this land'], 403);
        }

        $validatedData = $request->validate([
            'price' => 'required|numeric|min:100|max:100000000000',
        ]);

        $land->fixed_price = $validatedData['price'];
        $land->save();

        return response()->json([
            'message' => 'Price updated successfully',
            'land' => $land
        ]);
    }

    public function cancelSell($id): JsonResponse
    {
        $land = Land::findOrFail($id);

        // Check if the authenticated user owns the land
        if ($land->owner_id !== Auth::id()) {
            return response()->json(['error' => 'You do not own this land'], 403);
        }

        $land->is_for_sale = false;
        $land->fixed_price = null;
        $land->save();

        return response()->json([
            'message' => 'Land removed from sale',
            'land' => $land
        ]);
    }
}
