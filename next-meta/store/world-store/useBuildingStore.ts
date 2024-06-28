import { create } from "zustand";
import { MapboxGeoJSONFeature } from "mapbox-gl";

export interface Building {
  fid: number;
  owner_id: number;
  forsale: boolean;
  auction?: boolean;
  basePrice?: number;
}

interface BuildingStoreState {
  selectedBuilding: MapboxGeoJSONFeature | null;
  setSelectedBuilding: (building: MapboxGeoJSONFeature) => void;
  buildings: Building[];
}

const buildingFakeDb: Building[] = [
  { fid: 1073, owner_id: 1, forsale: true, basePrice: 100 },
  { fid: 1040, owner_id: 1, forsale: false },
  { fid: 1137, owner_id: 2, forsale: true, basePrice: 50, auction: true },
  { fid: 755, owner_id: 2, forsale: false },
];

const useBuildingStore = create<BuildingStoreState>((set) => ({
  buildings: buildingFakeDb,
  selectedBuilding: null,
  setSelectedBuilding: (building) => set({ selectedBuilding: building }),
}));

export default useBuildingStore;
