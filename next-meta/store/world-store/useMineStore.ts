import { create } from "zustand";
import { MapboxGeoJSONFeature } from "mapbox-gl";

export interface Mine {
  fid: number;
  owner_id: number;
  forsale: boolean;
  auction?: boolean;
  basePrice?: number;
}
interface MineStoreState {
  selectedMine: MapboxGeoJSONFeature | null;
  setSelectedMine: (mine: MapboxGeoJSONFeature) => void;
  mines: Mine[] | [];
}

const useMineStore = create<MineStoreState>((set) => ({
  mines: [],
  selectedMine: null,
  setSelectedMine: (mine) => set({ selectedMine: mine }),
}));
export default useMineStore;
