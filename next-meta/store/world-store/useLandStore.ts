import { create } from "zustand";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import axiosInstance from "@/lib/axios-instance";
import { fetchLandsFromServer, fetchLandDetails } from "@/lib/api/land";

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
  "fill-color": string;
}

interface LandStoreState {
  selectedLand: MapboxGeoJSONFeature | null;
  setSelectedLand: (land: MapboxGeoJSONFeature | null) => void;
  lands: Land[];
  fetchLands: (bounds: mapboxgl.LngLatBounds, zoom: number) => Promise<Land[]>;
  setSelectedLandFromServer: (id: number) => Promise<void>;
  currentLandDetails: LandWithDetails | null;
  fetchLandDetails: (id: number) => Promise<void>;
  currentFetchController: AbortController | null;
}

const useLandStore = create<LandStoreState>((set, get) => ({
  lands: [],
  selectedLand: null,
  currentLandDetails: null,
  currentFetchController: null,

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
      const lands = await fetchLandsFromServer(bounds, zoom);
      set({ lands });
      return lands;
    } catch (error) {
      console.error("Error fetching lands:", error);
      return [];
    }
  },

  setSelectedLandFromServer: async (id: number) => {
    try {
      const landDetails = await fetchLandDetails(id);
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
      if (axiosInstance.isCancel(error)) {
        console.log('Request canceled:', (error as Error).message);
      } else {
        console.error("Error fetching land details:", error);
      }
    }
  },

  fetchLandDetails: async (id: number) => {
    const currentController = get().currentFetchController;
    if (currentController) {
      currentController.abort();
    }

    const controller = new AbortController();
    set({ currentFetchController: controller });

    try {
      const landDetails = await fetchLandDetails(id, controller.signal);
      set({ currentLandDetails: landDetails });
    } catch (error) {
      if (axiosInstance.isCancel(error)) {
        console.log('Request canceled:', (error as Error).message);
      } else {
        console.error("Error fetching land details:", error);
        set({ currentLandDetails: null });
      }
    } finally {
      if (get().currentFetchController === controller) {
        set({ currentFetchController: null });
      }
    }
  },
}));

export default useLandStore;