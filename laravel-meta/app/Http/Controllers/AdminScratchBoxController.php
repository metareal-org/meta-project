<?php

namespace App\Http\Controllers;

use App\Models\Land;
use App\Models\ScratchBox;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminScratchBoxController extends Controller
{
    public function index()
    {
        $scratchBoxes = ScratchBox::with('lands')->paginate(20);
        return response()->json($scratchBoxes);
    }

    public function create(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'land_ids' => 'required|array',
            'land_ids.*' => 'integer|exists:lands,id',
        ]);

        $lands = Land::whereIn('id', $validatedData['land_ids'])
            ->where('is_locked', true)
            ->where('is_in_scratch', false)
            ->get();

        if ($lands->count() != count($validatedData['land_ids'])) {
            return response()->json(['error' => 'Some lands are not valid for scratch box'], 422);
        }

        DB::beginTransaction();

        try {
            $scratchBox = ScratchBox::create([
                'name' => $validatedData['name'],
                'price' => $lands->sum('fixed_price'),
            ]);

            $scratchBox->lands()->attach($lands->pluck('id'));

            $lands->each(function ($land) {
                $land->update(['is_in_scratch' => true]);
            });

            DB::commit();

            return response()->json(['message' => 'Scratch box created successfully', 'scratch_box' => $scratchBox]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create scratch box: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $scratchBox = ScratchBox::findOrFail($id);

        DB::beginTransaction();

        try {
            $scratchBox->lands()->update(['is_in_scratch' => false]);
            $scratchBox->delete();

            DB::commit();

            return response()->json(['message' => 'Scratch box deleted successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to delete scratch box: ' . $e->getMessage()], 500);
        }
    }

    public function getAvailableLands()
    {
        $lands = Land::where('is_locked', true)
            ->where('is_in_scratch', false)
            ->paginate(20);
        return response()->json($lands);
    }

    public function getAllAvailableLandIds()
    {
      

        $lands = Land::where('is_locked', true)
            ->where('is_in_scratch', false)
            ->pluck('id')
            ->toArray();
        return response()->json($lands);
    }
}
