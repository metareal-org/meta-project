// store/auction-store/useAuctionStore.ts
import { create } from "zustand";
import { placeBid, fetchBidsForAuction, cancelAuction } from "@/lib/api/auction";
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

interface AuctionStore {
  auctions: Auction[];
  activeAuction: Auction | null;
  bids: Bid[];
  isLoading: boolean;
  error: string | null;
  placeBid: (auctionId: number, bidAmount: number) => Promise<AxiosResponse>;
  fetchBids: (auctionId: number) => Promise<void>;
  cancelAuction: (auctionId: number) => Promise<AxiosResponse>;
}

export const useAuctionStore = create<AuctionStore>((set) => ({
  auctions: [],
  activeAuction: null,
  bids: [],
  isLoading: false,
  error: null,

  placeBid: async (auctionId: number, bidAmount: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await placeBid(auctionId, bidAmount);
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

  fetchBids: async (auctionId: number) => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchBidsForAuction(auctionId);
      set({ bids: data, isLoading: false });
    } catch (error) {
      console.error("Error fetching bids:", error);
      set({ error: "Failed to load bids. Please try again.", isLoading: false });
    }
  },

  cancelAuction: async (auctionId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await cancelAuction(auctionId);
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