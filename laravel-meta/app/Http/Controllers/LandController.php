<?php

namespace App\Http\Controllers;

use App\Models\Land;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LandController extends Controller
{
    private const MIN_ZOOM_LEVEL = 4; // Lowered from 5 to 4

    public function all(): JsonResponse
    {
        $lands = Land::all();
        return response()->json($lands);
    }
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

    public function getMarketplaceLands(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 20); 
        $sortBy = $request->input('sort_by', 'fixed_price'); // Default sort by price
        $sortOrder = $request->input('sort_order', 'asc'); // Default ascending order
        $userLandsOnly = $request->boolean('user_lands_only', false); // New flag to filter user lands
        $showOnlyForSale = $request->boolean('for_sale', false); // Flag to show only lands for sale
        $search = $request->input('search', ''); // Search term

        $query = Land::with('owner:id,nickname');

        // Filter user lands if the flag is set
        if ($userLandsOnly) {
            $user = Auth::user();
            $query->where('owner_id', $user->id);
        }

        // Filter lands for sale if the flag is set
        if ($showOnlyForSale) {
            $query->whereNotNull('fixed_price')->where('fixed_price', '>', 0);
        }
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('full_id', 'like', "%{$search}%")
                    ->orWhere('region', 'like', "%{$search}%")
                    ->orWhere('zone', 'like', "%{$search}%");
            });
        }
        $query->orderBy($sortBy, $sortOrder);
        $lands = $query->paginate($perPage);
        return response()->json([
            'data' => $lands->items(),
            'current_page' => $lands->currentPage(),
            'last_page' => $lands->lastPage(),
            'per_page' => $lands->perPage(),
            'total' => $lands->total(),
        ]);
    }



    public function show($id): JsonResponse
    {
        $land = Land::with([
            'owner',
            'transactions',
            'offers',
            'activeAuction.bids.user'
        ])->findOrFail($id);
        $response = $land->toArray();
        $response['active_auction'] = $land->formatted_active_auction;
        $response['has_active_auction'] = $land->has_active_auction;
        $response['minimum_bid'] = $land->minimum_bid;
        return response()->json($response);
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
        $land->save();
        return response()->json([
            'message' => 'Price set successfully',
            'land' => $land
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

        $land->fixed_price = null;
        $land->save();

        return response()->json([
            'message' => 'Land removed from sale',
            'land' => $land
        ]);
    }
}
