import { create } from 'zustand';
import { LandWithDetails } from "@/store/world-store/useLandStore";
import axiosInstance from "@/lib/axios-instance";

export interface PaginatedResponse {
  data: LandWithDetails[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface MarketLandStore {
  lands: LandWithDetails[];
  currentPage: number;
  totalPages: number;
  sortBy: string;
  sortOrder: string;
  search: string;
  loading: boolean;
  activeTab: string;
  showOnlyForSale: boolean;
  marketFetchLands: (user: any) => Promise<void>;
  marketHandlePageChange: (page: number) => void;
  marketHandleSort: (newSortBy: string) => void;
  marketHandleSearch: (value: string) => void;
  marketHandleForSaleFilter: (value: boolean) => void;
  marketHandleTabChange: (value: string) => void;
}

const useMarketLandStore = create<MarketLandStore>((set, get) => ({
  lands: [],
  currentPage: 1,
  totalPages: 1,
  sortBy: "fixed_price",
  sortOrder: "asc",
  search: "",
  loading: true,
  activeTab: "all",
  showOnlyForSale: false,

  marketFetchLands: async (user) => {
    if (!user) return;
    try {
      set({ loading: true });
      const { currentPage, sortBy, sortOrder, search, showOnlyForSale, activeTab } = get();
      const response = await axiosInstance.get<PaginatedResponse>("/marketplace/lands", {
        params: { page: currentPage, sort_by: sortBy, sort_order: sortOrder, search, for_sale: showOnlyForSale, user_lands_only: activeTab === "user" },
      });
      set({
        lands: response.data.data,
        currentPage: response.data.current_page,
        totalPages: response.data.last_page,
        loading: false,
      });
    } catch (error) {
      console.error("Failed to fetch lands:", error);
      set({ loading: false });
    }
  },

  marketHandlePageChange: (page: number) => set({ currentPage: page }),

  marketHandleSort: (newSortBy: string) => set((state) => ({
    sortOrder: newSortBy === state.sortBy ? (state.sortOrder === "asc" ? "desc" : "asc") : "asc",
    sortBy: newSortBy,
    currentPage: 1,
  })),

  marketHandleSearch: (value: string) => set({ search: value, currentPage: 1 }),

  marketHandleForSaleFilter: (value: boolean) => set({ showOnlyForSale: value, currentPage: 1 }),

  marketHandleTabChange: (value: string) => set({ activeTab: value, currentPage: 1, showOnlyForSale: false }),
}));

export default useMarketLandStore;