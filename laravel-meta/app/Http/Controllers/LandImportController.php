<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Land;
use App\Models\LandVersion;
use geoPHP;

class LandImportController extends Controller
{
    private function processFeatue($feature)
    {
        $coordinates = $feature->geometry->coordinates;
        $firstCoordinate = $feature->geometry->type === 'MultiPolygon' ? $coordinates[0][0][0] : $coordinates[0][0];
        $geom = geoPHP::load(json_encode($feature->geometry), 'json');
        $areaInSquareMeters = $geom->getArea() * 111319 * 111319;
        $centroid = $geom->getCentroid();
        Land::create([
            'full_id' => $feature->properties->full_id ?? null,
            'region' => $feature->properties->region ?? null,
            'zone' => $feature->properties->zone ?? null,
            'coordinates' => json_encode($feature->geometry),
            'latitude' => $firstCoordinate[1],
            'longitude' => $firstCoordinate[0],
            'center_point' => json_encode([
                'longitude' => $centroid->getX(),
                'latitude' => $centroid->getY()
            ]),
            'size' => round($areaInSquareMeters, 2),
            'owner_id' => 1,
            'fixed_price' => null,
            'is_for_sale' => false,
            'is_locked' => false,
            'building_id' => 0,
        ]);
    }
    private function validateGeoJSON($data)
    {
        if (!isset($data->type) || $data->type !== 'FeatureCollection') {
            return "Missing or incorrect 'type' property";
        }
        if (!isset($data->features) || !is_array($data->features)) {
            return "Missing or invalid 'features' array";
        }
        foreach ($data->features as $index => $feature) {
            if (!isset($feature->type) || $feature->type !== 'Feature') {
                return "Invalid feature type at index $index";
            }

            if (!isset($feature->properties) || !is_object($feature->properties)) {
                return "Missing or invalid 'properties' at feature index $index";
            }

            if (!isset($feature->geometry) || !is_object($feature->geometry)) {
                return "Missing or invalid 'geometry' at feature index $index";
            }

            if (!isset($feature->geometry->type) || !isset($feature->geometry->coordinates)) {
                return "Invalid geometry structure at feature index $index";
            }
        }

        return true;
    }

    public function getVersion($id)
    {
        $version = LandVersion::findOrFail($id);
        return response()->json($version);
    }



    public function deleteVersion($id)
    {
        try {
            $version = LandVersion::findOrFail($id);
            $version->delete();

            if ($version->is_active) {
                $this->updateLandsTable();
            }

            return response()->json(['message' => 'Version deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Delete failed: ' . $e->getMessage()], 500);
        }
    }

    private function updateLandsTable()
    {
        DB::beginTransaction();

        try {
            Land::truncate();

            $activeVersions = LandVersion::where('is_active', true)->get();
            foreach ($activeVersions as $version) {
                $data = json_decode($version->data);
                foreach ($data->features as $feature) {
                    $this->processFeatue($feature);
                }
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }



    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file',
            'file_name' => 'required|string|max:255',
            'version_name' => 'required|string|max:255',
        ]);

        $file = $request->file('file');
        $jsonContents = file_get_contents($file->path());
        $data = json_decode($jsonContents);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json(['error' => 'Invalid JSON format: ' . json_last_error_msg()], 400);
        }

        $validationResult = $this->validateGeoJSON($data);
        if ($validationResult !== true) {
            return response()->json(['error' => 'Invalid GeoJSON format: ' . $validationResult], 400);
        }

        try {
            LandVersion::create([
                'data' => $jsonContents,
                'file_name' => $request->file_name,
                'version_name' => $request->version_name,
                'is_active' => false,
                'is_locked' => false,
            ]);

            return response()->json(['message' => 'Import successful'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Import failed: ' . $e->getMessage()], 500);
        }
    }

    public function getVersions()
    {
        $versions = LandVersion::select('id', 'file_name', 'version_name', 'is_active', 'is_locked', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        if ($versions->isEmpty()) {
            return response()->json(['message' => 'No versions found'], 404);
        }

        return response()->json($versions);
    }

    public function updateActiveVersions(Request $request)
    {
        $request->validate([
            'active_versions' => 'required|array',
            'active_versions.*' => 'integer|exists:land_versions,id',
        ]);

        DB::beginTransaction();

        try {
            LandVersion::query()->update(['is_active' => false]);
            LandVersion::whereIn('id', $request->active_versions)->update(['is_active' => true]);

            Land::truncate();

            $activeVersions = LandVersion::where('is_active', true)->get();
            foreach ($activeVersions as $version) {
                $data = json_decode($version->data);
                foreach ($data->features as $feature) {
                    $this->processFeatue($feature);
                }
            }

            DB::commit();
            return response()->json(['message' => 'Active versions updated successfully'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Update failed: ' . $e->getMessage()], 500);
        }
    }

    public function lockLands($versionId)
    {
        DB::beginTransaction();

        try {
            $version = LandVersion::findOrFail($versionId);
            $data = json_decode($version->data);

            if (!$data || !isset($data->features)) {
                throw new \Exception("Invalid data format in version");
            }

            $fullIds = collect($data->features)
                ->pluck('properties.full_id')
                ->filter()
                ->values()
                ->toArray();

            if (empty($fullIds)) {
                throw new \Exception("No valid full_id found in the version data");
            }

            $affectedRows = Land::whereIn('full_id', $fullIds)->update(['is_locked' => true]);

            if ($affectedRows == 0) {
                throw new \Exception("No lands were updated. Make sure the lands exist in the database.");
            }

            $version->is_locked = true;
            $version->save();

            DB::commit();
            return response()->json(['message' => 'Lands locked successfully', 'affected_rows' => $affectedRows], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Lock failed: ' . $e->getMessage()], 500);
        }
    }

    public function unlockLands($versionId)
    {
        DB::beginTransaction();

        try {
            $version = LandVersion::findOrFail($versionId);
            $data = json_decode($version->data);

            if (!$data || !isset($data->features)) {
                throw new \Exception("Invalid data format in version");
            }

            $fullIds = collect($data->features)
                ->pluck('properties.full_id')
                ->filter()
                ->values()
                ->toArray();

            if (empty($fullIds)) {
                throw new \Exception("No valid full_id found in the version data");
            }

            $affectedRows = Land::whereIn('full_id', $fullIds)->update(['is_locked' => false]);

            if ($affectedRows == 0) {
                throw new \Exception("No lands were updated. Make sure the lands exist in the database.");
            }

            $version->is_locked = false;
            $version->save();

            DB::commit();
            return response()->json(['message' => 'Lands unlocked successfully', 'affected_rows' => $affectedRows], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Unlock failed: ' . $e->getMessage()], 500);
        }
    }

}
