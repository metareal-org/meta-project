import { create } from 'zustand';
import axiosInstance from "@/lib/axios-instance";
import { ScratchBox } from "../../app/market/scratches/types";
import { LandWithDetails } from "@/store/world-store/useLandStore";

interface MarketScratcheState {
  availableScratchBoxes: ScratchBox[];
  ownedScratchBoxes: ScratchBox[];
  loading: boolean;
  error: string | null;
  wonLands: LandWithDetails[];
  filter: string;
  setFilter: (filter: string) => void;
  marketFetchScratchBoxes: () => Promise<void>;
  marketBuyScratchBox: (id: number) => Promise<void>;
  marketOpenScratchBox: (id: number) => Promise<void>;
}

export const useMarketScratcheStore = create<MarketScratcheState>((set, get) => ({
  availableScratchBoxes: [],
  ownedScratchBoxes: [],
  loading: false,
  error: null,
  wonLands: [],
  filter: "all",

  setFilter: (filter) => set({ filter }),

  marketFetchScratchBoxes: async () => {
    try {
      set({ loading: true, error: null });
      const [availableResponse, ownedResponse] = await Promise.all([
        axiosInstance.get("/scratch-boxes/available"),
        axiosInstance.get("/scratch-boxes/owned")
      ]);
      set({
        availableScratchBoxes: availableResponse.data,
        ownedScratchBoxes: ownedResponse.data,
        loading: false
      });
    } catch (err) {
      set({ error: "Failed to fetch scratch boxes", loading: false });
    }
  },

  marketBuyScratchBox: async (id: number) => {
    try {
      await axiosInstance.post(`/scratch-boxes/${id}/buy`);
      get().marketFetchScratchBoxes();
    } catch (err) {
      set({ error: "Failed to buy scratch box" });
    }
  },

  marketOpenScratchBox: async (id: number) => {
    try {
      const response = await axiosInstance.post<{ lands: LandWithDetails[] }>(`/scratch-boxes/${id}/open`);
      set({ wonLands: response.data.lands });
      get().marketFetchScratchBoxes();
    } catch (err) {
      set({ error: "Failed to open scratch box" });
    }
  },
}));