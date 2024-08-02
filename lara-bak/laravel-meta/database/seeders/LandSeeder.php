<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use geoPHP;

class LandSeeder extends Seeder
{
    public function run(): void
    {
        $jsonPath = Storage::path('citylands.geojson');
        $jsonContents = file_get_contents($jsonPath);
        $data = json_decode($jsonContents, true);

        foreach ($data['features'] as $index => $feature) {
            $coordinates = $feature['geometry']['coordinates'];

            // For MultiPolygon, get the first coordinate of the first polygon
            if ($feature['geometry']['type'] === 'MultiPolygon') {
                $firstCoordinate = $coordinates[0][0][0];
            } else {
                // For Polygon, get the first coordinate
                $firstCoordinate = $coordinates[0][0];
            }

            // Longitude is the first element, Latitude is the second
            $longitude = $firstCoordinate[0];
            $latitude = $firstCoordinate[1];

            // Calculate area
            $geom = geoPHP::load(json_encode($feature['geometry']), 'json');
            $areaInSquareMeters = $geom->getArea() * 111319 * 111319; // Convert from degrees to square meters

            // Calculate center point
            $centroid = $geom->getCentroid();
            $centerPoint = [
                'longitude' => $centroid->getX(),
                'latitude' => $centroid->getY()
            ];

            $isForSale = (bool)random_int(0, 1);

            DB::table('lands')->insert([
                'full_id' => $feature['properties']['full_id'] ?? null,
                'region' => $feature['properties']['region'] ?? null,
                'zone' => $feature['properties']['zone'] ?? null,
                'coordinates' => json_encode($feature['geometry']),  // Store entire geometry
                'latitude' => $latitude,
                'longitude' => $longitude,
                'center_point' => json_encode($centerPoint),  // Add this line
                'size' => round($areaInSquareMeters, 2), // Round to 2 decimal places
                'owner_id' => random_int(1, 2),
                'fixed_price' => $isForSale ? random_int(100, 1000) : null,
                'is_for_sale' => $isForSale,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}