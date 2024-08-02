<?php

namespace App\Http\Controllers;

use App\Models\Reward;
use App\Models\UserReward;
use App\Models\Asset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RewardController extends Controller
{
    public function index()
    {
        $rewards = Reward::all();
        return response()->json($rewards);
    }

    public function show($id)
    {
        $reward = Reward::findOrFail($id);
        return response()->json($reward);
    }

    public function claim($id)
    {
        $user = Auth::user();
        $reward = Reward::findOrFail($id);

        // Check if the user has already claimed this reward
        $existingClaim = UserReward::where('user_id', $user->id)
            ->where('reward_id', $reward->id)
            ->first();

        if ($existingClaim) {
            return response()->json(['message' => 'You have already claimed this reward.'], 400);
        }

        // Create a new user_reward record
        UserReward::create([
            'user_id' => $user->id,
            'reward_id' => $reward->id,
            'is_claimed' => true,
            'claimed_at' => now(),
        ]);

        // Update user's assets
        $asset = Asset::where('user_id', $user->id)->first();
        $asset->{$reward->type} += $reward->amount;
        $asset->save();

        return response()->json(['message' => 'Reward claimed successfully.']);
    }

    public function userRewards()
    {
        $user = Auth::user();
        $userRewards = UserReward::with('reward')->where('user_id', $user->id)->get();
        return response()->json($userRewards);
    }
}