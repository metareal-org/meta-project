import useLandStore, { Land } from "@/store/world-store/useLandStore";
import { GeoJsonLoader } from "@/core/loaders/utils/geojson-loader";

export const loadLands = async () => {
  const { lands, fetchLands } = useLandStore.getState();
  
  // Fetch lands if not already loaded
  if (lands.length === 0) {
    await fetchLands();
  }

  const landMap: { [key: number]: Land } = {};
  useLandStore.getState().lands.forEach((land) => {
    landMap[land.fid] = land;
  });

  const getColorForLand = (owner_id: number, is_for_sale: boolean) => {
    if (owner_id === 1 && !is_for_sale) return "navy";
    if (owner_id === 1 && is_for_sale) return "orange";
    if (owner_id === 2 && !is_for_sale) return "cyan";
    if (owner_id === 2 && is_for_sale) return "green";
    return "#132836";
  };

  GeoJsonLoader<Land>("/assets/geojson/citylands.geojson", "citylands", "citylands", landMap, getColorForLand);
};