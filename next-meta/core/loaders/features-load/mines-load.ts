import useMineStore, { Mine } from "@/store/world-store/useMineStore";
import { GeoJsonLoader } from "@/core/loaders/utils/geojson-loader";

export const loadMines = () => {
  const { mines } = useMineStore.getState();
  const mineMap: { [key: number]: Mine } = {};
  mines.forEach((mine) => {
    mineMap[mine.fid] = mine;
  });

  const getColorForMine = (ownerId: number, forSale: boolean) => {
    return "#1f3232";
  };

  GeoJsonLoader<Mine>("/assets/geojson/mines.geojson", "mines", "mines", mineMap, getColorForMine);
};
