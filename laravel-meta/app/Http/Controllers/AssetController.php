<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AssetController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        return response()->json(['assets' => $user->assets]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validatedData = $request->validate([
            'asset_type' => 'required|string|in:gift,ticket,wood,stone,sand,gold',
            'amount' => 'required|integer',
            'action' => 'required|in:increase,decrease'
        ]);

        $assetType = $validatedData['asset_type'];
        $amount = $validatedData['amount'];
        $action = $validatedData['action'];

        $success = false;

        if ($action === 'increase') {
            $success = $user->assets->increase($assetType, $amount);
        } elseif ($action === 'decrease') {
            $success = $user->assets->decrease($assetType, $amount);
        }

        if ($success) {
            $user->refresh();
            return response()->json([
                'message' => 'Assets updated successfully',
                'assets' => $user->assets
            ]);
        } else {
            return response()->json([
                'message' => 'Failed to update assets',
                'assets' => $user->assets
            ], 400);
        }
    }
}
