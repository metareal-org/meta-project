// store/player-store/usePlayerOffersStore.ts

import { create } from "zustand";
import { fetchUserOffers } from "@/lib/api/offer";

interface Offer {
  id: number;
  land_id: number;
  price: number;
  created_at: string;
  is_accepted: boolean;
  land: {
    coordinates: string;
  };
}

interface PlayerOffersStore {
  playerOffers: Offer[];
  isLoading: boolean;
  error: string | null;
  fetchPlayerOffers: () => Promise<void>;
  updateOffer: (offerId: number, updatedOffer: Offer) => void;
  removeOffer: (offerId: number) => void;
}

export const usePlayerOffersStore = create<PlayerOffersStore>((set) => ({
  playerOffers: [],
  isLoading: false,
  error: null,
  fetchPlayerOffers: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchUserOffers();
      set({ playerOffers: data, isLoading: false });
    } catch (error) {
      console.error("Error fetching offers:", error);
      set({ error: "Failed to load offers. Please try again.", isLoading: false });
    }
  },
  updateOffer: (offerId, updatedOffer) => {
    set((state) => ({
      playerOffers: state.playerOffers.map((offer) =>
        offer.id === offerId ? updatedOffer : offer
      ),
    }));
  },
  removeOffer: (offerId) => {
    set((state) => ({
      playerOffers: state.playerOffers.filter((offer) => offer.id !== offerId),
    }));
  },
}));