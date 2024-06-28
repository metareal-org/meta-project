import { create } from "zustand";
import { MapboxGeoJSONFeature } from "mapbox-gl";

export interface Land {
  fid: number;
  owner_id: number;
  forsale: boolean;
  auction?: boolean;
  basePrice?: number;
  type: "building" | "mine";
}

interface LandStoreState {
  selectedLand: MapboxGeoJSONFeature | null;
  setSelectedLand: (land: MapboxGeoJSONFeature | null) => void;
  lands: Land[];
}

const landFakeDb: Land[] = [
  { fid: 1073, owner_id: 1, forsale: true, basePrice: 100, type: "building" },
  { fid: 1040, owner_id: 1, forsale: false, type: "building" },
  { fid: 1137, owner_id: 2, forsale: true, basePrice: 50, auction: true, type: "building" },
  { fid: 755, owner_id: 2, forsale: false, type: "building" },
  // Add mine data here
];

const useLandStore = create<LandStoreState>((set) => ({
  lands: landFakeDb,
  selectedLand: null,
  setSelectedLand: (land) => set({ selectedLand: land }),
}));

export default useLandStore;