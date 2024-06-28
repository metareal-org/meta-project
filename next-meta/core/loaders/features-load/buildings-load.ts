import useBuildingStore, { Building } from "@/store/world-store/useBuildingStore";
import { GeoJsonLoader } from "@/core/loaders/utils/geojson-loader";
export const loadBuildings = () => {
  const { buildings } = useBuildingStore.getState();
  const buildingMap: { [key: number]: Building } = {};
  buildings.forEach((building) => {
    buildingMap[building.fid] = building;
  });

  const getColorForBuilding = (ownerId: number, forSale: boolean) => {
    if (ownerId === 1 && !forSale) return "navy";
    if (ownerId === 1 && forSale) return "orange";
    if (ownerId === 2 && !forSale) return "cyan";
    if (ownerId === 2 && forSale) return "green";
    return "#132836";
  };

  GeoJsonLoader<Building>("/assets/geojson/citylands.geojson", "citylands", "citylands", buildingMap, getColorForBuilding);
};
