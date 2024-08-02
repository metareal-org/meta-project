// store/player-store/usePlayerOffersStore.ts

import { create } from "zustand";
import { apiSubmitOffer, apiUpdateOffer, apiFetchOffers, apiDeleteOffer, apiFetchuser_offers, apiAcceptOffer } from "@/lib/api/offer";
import { DEBUG } from "@/core/constants";

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
  submitOffer: (landId: number, price: number) => Promise<any>;
  updateOffer: (offerId: number, price: number) => Promise<any>;
  fetchOffers: (landId: number) => Promise<any>;
  deleteOffer: (offerId: number) => Promise<any>;
  acceptOffer: (offerId: number) => Promise<any>;
}

export const usePlayerOffersStore = create<PlayerOffersStore>((set, get) => ({
  playerOffers: [],
  isLoading: false,
  error: null,

  fetchPlayerOffers: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiFetchuser_offers();
      set({ playerOffers: data, isLoading: false });
    } catch (error) {
      DEBUG && console.error("Error fetching offers:", error);
      set({ error: "Failed to load offers. Please try again.", isLoading: false });
    }
  },

  submitOffer: async (landId: number, price: number) => {
    try {
      const response = await apiSubmitOffer(landId, price);
      await get().fetchPlayerOffers();
      return response;
    } catch (error) {
      DEBUG && console.error("Failed to submit offer:", error);
      throw error;
    }
  },

  updateOffer: async (offerId: number, price: number) => {
    try {
      const response = await apiUpdateOffer(offerId, price);
      await get().fetchPlayerOffers(); 
      return response;
    } catch (error) {
      DEBUG && console.error("Failed to update offer:", error);
      throw error;
    }
  },
  
  fetchOffers: async (landId: number) => {
    try {
      const response = await apiFetchOffers(landId);
      return response;
    } catch (error) {
      DEBUG && console.error("Failed to fetch offers:", error);
      throw error;
    }
  },


  deleteOffer: async (offerId: number) => {
    try {
      const response = await apiDeleteOffer(offerId);
      set((state) => ({
        playerOffers: state.playerOffers.filter((offer) => offer.id !== offerId),
      }));
      return response;
    } catch (error) {
      DEBUG && console.error("Failed to delete offer:", error);
      throw error;
    }
  },

  acceptOffer: async (offerId: number) => {
    try {
      const response = await apiAcceptOffer(offerId);
      set((state) => ({
        playerOffers: state.playerOffers.map((offer) => (offer.id === offerId ? { ...offer, is_accepted: true } : offer)),
      }));
      return response;
    } catch (error) {
      DEBUG && console.error("Failed to accept offer:", error);
      throw error;
    }
  },
}));
