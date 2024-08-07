import { create } from "zustand";
import axiosInstance from "@/lib/axios-instance";
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
      const response = await axiosInstance.post("/offers/user");
      set({ playerOffers: response.data, isLoading: false });
    } catch (error) {
      DEBUG && console.error("Error fetching offers:", error);
      set({ error: "Failed to load offers. Please try again.", isLoading: false });
    }
  },

  submitOffer: async (landId: number, price: number) => {
    try {
      const response = await axiosInstance.post("/offers/submit", { land_id: landId, price });
      await get().fetchPlayerOffers();
      return response.data;
    } catch (error) {
      DEBUG && console.error("Failed to submit offer:", error);
      throw error;
    }
  },

  updateOffer: async (offerId: number, price: number) => {
    try {
      const response = await axiosInstance.post(`/offers/update/${offerId}`, { price });
      await get().fetchPlayerOffers();
      return response.data;
    } catch (error) {
      DEBUG && console.error("Failed to update offer:", error);
      throw error;
    }
  },

  fetchOffers: async (landId: number) => {
    try {
      const response = await axiosInstance.get(`/offers/${landId}`);
      return response.data;
    } catch (error) {
      DEBUG && console.error("Failed to fetch offers:", error);
      throw error;
    }
  },
  deleteOffer: async (offerId: number) => {
    try {
      const response = await axiosInstance.post(`/offers/delete/${offerId}`);
      set((state) => ({
        playerOffers: state.playerOffers.filter((offer) => offer.id !== offerId),
      }));
      return response.data;
    } catch (error) {
      DEBUG && console.error("Failed to delete offer:", error);
      throw error;
    }
  },

  acceptOffer: async (offerId: number) => {
    try {
      const response = await axiosInstance.post(`/offers/accept/${offerId}`);
      set((state) => ({
        playerOffers: state.playerOffers.map((offer) => (offer.id === offerId ? { ...offer, is_accepted: true } : offer)),
      }));
      return response.data;
    } catch (error) {
      DEBUG && console.error("Failed to accept offer:", error);
      throw error;
    }
  },
}));
