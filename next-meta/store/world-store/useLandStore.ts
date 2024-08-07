import { create } from "zustand";
import axiosInstance from "@/lib/axios-instance";
import useMapStore from "@/store/engine-store/useMapStore";
import { DEBUG } from "@/core/constants";

export interface Land {
  id: number;
  name: string;
  owner_id: number;
  is_for_sale: boolean;
  is_locked: boolean;
  auction?: boolean;
  region?: string;
  fixed_price: number;
  type: "normal" | "mine";
  coordinates: string;
  latitude: number;
  longitude: number;
  has_active_auction: boolean;
}


interface LandStoreState {
  selectedLandId: number | null;
  setSelectedLandId: (landId: number | null) => void;
  lands: Land[];
  fetchLands: (bounds: mapboxgl.LngLatBounds, zoom: number) => Promise<Land[]>;
  currentLandDetails: LandWithDetails | null;
  fetchLandDetails: (id: number) => Promise<void>;
  currentFetchController: AbortController | null;
  currentLandAuctions: Auction[] | null;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}


export interface LandWithDetails extends Land {
  properties: Land;
  full_id?: string;
  zone?: string;
  owner_nickname?: string;
  center_point: string;
  size: number;
  "fill-color": string;
  minimum_bid: number;
  active_auction: {
    id: number;
    land_id: number;
    owner_id: number;
    minimum_price: number;
    minimum_bid: number;
    highest_bid: number;
    start_time: string;
    end_time: string;
    status: "active" | "canceled" | "done";
    bids: Bid[];
  };
}

interface Bid {
  id: number;
  user_id: number;
  amount: number;
  created_at: string;
}

interface Auction {
  id: number;
  land_id: number;
  is_active: boolean;
  end_time: string;
}

interface LandStoreState {
  selectedLandId: number | null;
  setSelectedLandId: (landId: number | null) => void;
  lands: Land[];
  fetchLands: (bounds: mapboxgl.LngLatBounds, zoom: number) => Promise<Land[]>;
  currentLandDetails: LandWithDetails | null;
  fetchLandDetails: (id: number) => Promise<void>;
  currentFetchController: AbortController | null;
  currentLandAuctions: Auction[] | null;
}

const useLandStore = create<LandStoreState>((set, get) => ({
  lands: [],
  selectedLandId: null,
  currentLandDetails: null,
  currentFetchController: null,
  currentLandAuctions: null,
  isLoading: false,

  setIsLoading: (loading: boolean) => set({ isLoading: loading }),

  setSelectedLandId: (landId: number | null) => {
    set({ selectedLandId: landId, isLoading: true });
    if (landId !== null) {
      get().fetchLandDetails(landId);
    } else {
      set({ currentLandDetails: null, currentLandAuctions: null, isLoading: false });
    }
  },

  fetchLands: async (bounds, zoom) => {
    try {
      const response = await axiosInstance.get("/lands", {
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
    set({ currentFetchController: controller, isLoading: true });

    try {
      const response = await axiosInstance.get(`/lands/${id}`, { signal: controller.signal });
      const landDetails = response.data;
      set({ currentLandDetails: landDetails, isLoading: false });
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
        DEBUG && console.log("Request canceled:", (error as Error).message);
      } else {
        console.error("Error fetching land details:", error);
        set({ currentLandDetails: null });
      }
    } finally {
      if (get().currentFetchController === controller) {
        set({ currentFetchController: null, isLoading: false });
      }
    }
  },
}));

export default useLandStore;