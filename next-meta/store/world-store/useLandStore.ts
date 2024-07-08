// store/world-store/useLandStore.ts

import { create } from "zustand";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import axiosInstance from "@/lib/axios-instance";
import { SERVER } from "@/core/constants";

export interface Land {
  id: number;
  owner_id: number;
  is_for_sale: boolean;
  auction?: boolean;
  region?: string;
  fixed_price?: number;
  type: "building" | "mine";
  coordinates: string;
  latitude: number;
  longitude: number;
}

export interface LandWithDetails extends Land {
  properties: Land;
  owner_nickname?: string;
  size: number;
}

interface LandStoreState {
  selectedLand: MapboxGeoJSONFeature | null;
  setSelectedLand: (land: MapboxGeoJSONFeature | null) => void;
  lands: Land[];
  fetchLands: (bounds: mapboxgl.LngLatBounds, zoom: number) => Promise<Land[]>;
  setSelectedLandFromServer: (id: number) => Promise<void>;
  currentLandDetails: LandWithDetails | null;
  fetchLandDetails: (id: number) => Promise<void>;
}

const useLandStore = create<LandStoreState>((set, get) => ({
  lands: [],
  selectedLand: null,
  currentLandDetails: null,
  setSelectedLand: (land) => {
    set({ selectedLand: land });
    if (land && land.properties && land.properties.id) {
      get().fetchLandDetails(land.properties.id);
    } else {
      set({ currentLandDetails: null });
    }
  },
  fetchLands: async (bounds, zoom) => {
    try {
      const response = await axiosInstance.get(SERVER + "/lands", {
        params: {
          bounds: {
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest(),
          },
          zoom,
        },
      });
      const lands = response.data;
      console.log("lands fetched:", lands);
      set({ lands });
      return lands;
    } catch (error) {
      console.error("Error fetching lands:", error);
      return [];
    }
  },
  setSelectedLandFromServer: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/lands/${id}`);
      const landDetails = response.data;
      set((state) => {
        if (!state.selectedLand) return state;
        const updatedSelectedLand: MapboxGeoJSONFeature = {
          ...state.selectedLand,
          properties: {
            ...state.selectedLand.properties,
            ...landDetails,
          },
        };
        return { selectedLand: updatedSelectedLand, currentLandDetails: landDetails };
      });
    } catch (error) {
      console.error("Error fetching land details:", error);
    }
  },
  fetchLandDetails: async (id: number) => {
    try {
      const response = await axiosInstance.get(`${SERVER}/lands/${id}`);
      const landDetails = response.data;
      set({ currentLandDetails: landDetails });
    } catch (error) {
      console.error("Error fetching land details:", error);
      set({ currentLandDetails: null });
    }
  },
}));

export default useLandStore;