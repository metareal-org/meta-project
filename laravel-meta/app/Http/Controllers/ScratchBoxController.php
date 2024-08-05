<?php

namespace App\Http\Controllers;

use App\Models\ScratchBox;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ScratchBoxController extends Controller
{
    public function index()
    {
        $availableScratchBoxes = ScratchBox::whereIn('status', ['available', 'sold'])->get();
        $ownedScratchBoxes = ScratchBox::whereIn('status', ['sold', 'opened'])
            ->whereHas('lands', function ($query) {
                $query->where('owner_id', Auth::id());
            })
            ->get();
        return response()->json([
            'available' => $availableScratchBoxes,
            'owned' => $ownedScratchBoxes
        ]);
    }

    public function buy(Request $request, $id)
    {
        $user = Auth::user();
        $scratchBox = ScratchBox::findOrFail($id);

        if ($scratchBox->status !== 'available') {
            return response()->json(['error' => 'This scratch box is not available for purchase.'], 400);
        }

        if (!$user->hasSufficientBnb($scratchBox->price)) {
            return response()->json(['error' => 'Insufficient BNB balance.'], 400);
        }

        DB::beginTransaction();
        try {
            if (!$user->removeBnb($scratchBox->price)) {
                throw new \Exception('Failed to deduct BNB from user balance.');
            }
            $scratchBox->update(['status' => 'sold']);
            // Add the scratch box to the user's assets
            $user->assets()->create([
                'type' => 'scratch_box',
                'amount' => $scratchBox->id
            ]);
            DB::commit();
            return response()->json(['message' => 'Scratch box purchased successfully.', 'scratch_box' => $scratchBox]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to purchase scratch box: ' . $e->getMessage()], 500);
        }
    }

    public function open($id)
    {
        $user = Auth::user();
        $scratchBox = ScratchBox::findOrFail($id);

        if ($scratchBox->status !== 'sold') {
            return response()->json(['error' => 'This scratch box is not available for opening.'], 400);
        }

        DB::beginTransaction();
        try {
            $lands = $scratchBox->open($user);
            DB::commit();
            return response()->json([
                'message' => 'Scratch box opened successfully.',
                'lands' => $lands
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to open scratch box: ' . $e->getMessage()], 500);
        }
    }

    public function available()
    {
        $availableScratchBoxes = ScratchBox::whereIn('status', ['available', 'sold'])->get();
        return response()->json($availableScratchBoxes);
    }

    public function owned()
    {
        $user = Auth::user();
        $ownedScratchBoxes = ScratchBox::whereIn('status', ['sold', 'opened'])
            ->whereHas('assets', function ($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->where('type', 'scratch_box');
            })
            ->get();
        return response()->json($ownedScratchBoxes);
    }
}