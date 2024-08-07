import { create } from 'zustand';
import axiosInstance from '@/lib/axios-instance';
import { toast } from "@/components/ui/use-toast";
import { AxiosResponse } from "axios";

export interface Bid {
  id: number;
  user_id: number;
  amount: number;
  created_at: string;
  user: {
    id: number;
    nickname: string;
  };
}

interface Auction {
  id: number;
  land_id: number;
  owner_id: number;
  minimum_price: number;
  start_time: string;
  end_time: string;
  status: "active" | "canceled" | "done";
  bids: Bid[];
  land: {
    id: number;
    region: string;
    center_point: string;
  };
}

interface AdminAuctionStore {
  auctions: Auction[];
  activeAuction: Auction | null;
  bids: Bid[];
  isLoading: boolean;
  error: string | null;
  selectedAuctions: number[];
  setSelectedAuctions: (auctions: number[]) => void;
  adminSelectAuction: (id: number) => void;
  adminFetchAuctions: () => Promise<void>;
  adminBulkCancelAuctions: (onSuccess: () => void) => Promise<void>;
  adminBulkRemoveAuctions: (onSuccess: () => void) => Promise<void>;
  adminPlaceBid: (auctionId: number, bidAmount: number) => Promise<AxiosResponse>;
  adminFetchBids: (auctionId: number) => Promise<void>;
  adminCancelAuction: (auctionId: number) => Promise<AxiosResponse>;
}

export const useAdminAuctionStore = create<AdminAuctionStore>((set, get) => ({
  auctions: [],
  activeAuction: null,
  bids: [],
  isLoading: false,
  error: null,
  selectedAuctions: [],

  setSelectedAuctions: (auctions) => set({ selectedAuctions: auctions }),
  
  adminSelectAuction: (id) => set((state) => ({
    selectedAuctions: state.selectedAuctions.includes(id)
      ? state.selectedAuctions.filter(auctionId => auctionId !== id)
      : [...state.selectedAuctions, id]
  })),

  adminFetchAuctions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/admin/manage/auctions");
      set({ 
        auctions: Array.isArray(response.data) ? response.data : response.data.data || [],
        isLoading: false
      });
    } catch (error) {
      console.error("Failed to fetch auctions:", error);
      set({ auctions: [], isLoading: false, error: "Failed to fetch auctions" });
    }
  },

  adminBulkCancelAuctions: async (onSuccess) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post('/admin/manage/lands/bulk-cancel-auctions', {
        auctionIds: get().selectedAuctions,
      });
      toast({
        title: "Success",
        description: "Auctions canceled successfully",
      });
      set({ selectedAuctions: [], isLoading: false });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel auctions",
        variant: "destructive",
      });
      set({ isLoading: false, error: "Failed to cancel auctions" });
    }
  },

  adminBulkRemoveAuctions: async (onSuccess) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post('/admin/manage/lands/bulk-remove-auctions', {
        auctionIds: get().selectedAuctions,
      });
      toast({
        title: "Success",
        description: "Auctions removed successfully",
      });
      set({ selectedAuctions: [], isLoading: false });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove auctions",
        variant: "destructive",
      });
      set({ isLoading: false, error: "Failed to remove auctions" });
    }
  },

  adminPlaceBid: async (auctionId: number, bidAmount: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`/admin/auctions/${auctionId}/bid`, { amount: bidAmount });
      set((state) => ({
        activeAuction: state.activeAuction ? { ...state.activeAuction, bids: [...state.activeAuction.bids, response.data.bid] } : null,
        isLoading: false,
      }));
      return response;
    } catch (error) {
      set({ error: "Failed to place bid. Please try again.", isLoading: false });
      return Promise.reject(error);
    }
  },

  adminFetchBids: async (auctionId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/admin/auctions/${auctionId}/bids`);
      set({ bids: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching bids:", error);
      set({ error: "Failed to load bids. Please try again.", isLoading: false });
    }
  },

  adminCancelAuction: async (auctionId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`/admin/auctions/${auctionId}/cancel`);
      set((state) => ({
        auctions: state.auctions.map(auction => 
          auction.id === auctionId ? { ...auction, status: 'canceled' } : auction
        ),
        activeAuction: state.activeAuction?.id === auctionId ? { ...state.activeAuction, status: 'canceled' } : state.activeAuction,
        isLoading: false,
      }));
      return response;
    } catch (error) {
      set({ error: "Failed to cancel auction. Please try again.", isLoading: false });
      return Promise.reject(error);
    }
  },
}));