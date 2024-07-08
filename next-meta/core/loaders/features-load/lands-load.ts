// core/loaders/features-load/lands-load.ts

import { GeoJsonLoader } from "@/core/loaders/utils/geojson-loader";

export const loadLands = () => {
  const getColorForLand = (owner_id: number, is_for_sale: boolean) => {
    if (owner_id === 1 && !is_for_sale) return "navy";
    if (owner_id === 1 && is_for_sale) return "orange";
    if (owner_id !== 1 && !is_for_sale) return "#134255";
    if (owner_id !== 1 && is_for_sale) return "green";
    return "#132836";
  };

  GeoJsonLoader(
    "citylands",
    "citylands",
    getColorForLand
  );
};