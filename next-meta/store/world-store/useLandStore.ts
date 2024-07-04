import { create } from "zustand";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import axios from "axios";
import { SERVER } from "@/core/constants";
import axiosInstance from "@/lib/axios-instance";

export interface Land {
  fid: number;
  owner_id: number;
  is_for_sale: boolean;
  auction?: boolean;
  fixed_price?: number;
  type: "building" | "mine";
}

interface LandStoreState {
  selectedLand: MapboxGeoJSONFeature | null;
  setSelectedLand: (land: MapboxGeoJSONFeature | null) => void;
  lands: Land[];
  fetchLands: () => Promise<void>;
}

const useLandStore = create<LandStoreState>((set) => ({
  lands: [],
  selectedLand: null,
  setSelectedLand: (land) => set({ selectedLand: land }),
  fetchLands: async () => {
    try {
      const response = await axiosInstance(SERVER + "/lands");
      set({ lands: response.data });
    } catch (error) {
      console.error("Error fetching lands:", error);
    }
  },
}));

export default useLandStore;
