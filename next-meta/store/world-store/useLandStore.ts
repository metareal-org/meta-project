import { create } from "zustand";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import axiosInstance from "@/lib/axios-instance";
import { fetchLandsFromServer, fetchLandDetails } from "@/lib/api/land";
import useMapStore from "@/store/engine-store/useMapStore";

export interface Land {
  id: number;
  owner_id: number;
  is_for_sale: boolean;
  auction?: boolean;
  region?: string;
  fixed_price: number;
  type: "building" | "mine";
  coordinates: string;
  latitude: number;
  longitude: number;
}

export interface LandWithDetails extends Land {
  properties: Land;
  owner_nickname?: string;
  center_point: string;
  size: number;
  "fill-color": string;
}

interface LandStoreState {
  selectedLandId: number | null;
  setSelectedLandId: (landId: number | null) => void;
  lands: Land[];
  fetchLands: (bounds: mapboxgl.LngLatBounds, zoom: number) => Promise<Land[]>;
  currentLandDetails: LandWithDetails | null;
  fetchLandDetails: (id: number) => Promise<void>;
  currentFetchController: AbortController | null;
}

const useLandStore = create<LandStoreState>((set, get) => ({
  lands: [],
  selectedLandId: null,
  currentLandDetails: null,
  currentFetchController: null,

  setSelectedLandId: (landId: number | null) => {
    set({ selectedLandId: landId });
    if (landId !== null) {
      get().fetchLandDetails(landId);
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

      const { mapbox } = useMapStore.getState();
      if (mapbox) {
        mapbox.setPaintProperty("citylands", "fill-color", [
          "case",
          ["==", ["get", "id"], id],
          "#83a66c",
          ["case", ["has", "fill-color"], ["get", "fill-color"], "rgba(0, 0, 0, 0.1)"],
        ]);
      }
    } catch (error) {
      if (axiosInstance.isCancel(error)) {
        console.log("Request canceled:", (error as Error).message);
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