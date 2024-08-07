import create from "zustand";
import axiosInstance from "@/lib/axios-instance";
import { toast } from "@/components/ui/use-toast";
import { LandWithDetails } from "../world-store/useLandStore";


interface AdminLandsStore {
  allLandIds: number[];
  pageLands: LandWithDetails[];
  currentPage: number;
  totalPages: number;
  selectedLands: number[];
  adminFetchPageLands: (page?: number) => Promise<void>;
  adminFetchAllLandIds: () => Promise<void>;
  adminHandleSelectAll: (checked: boolean) => void;
  adminHandleSelectLand: (id: number) => void;
  adminHandleBulkCreateAuctions: (auctionData: {
    minimumPrice: number;
    startTime: string;
    endTime: string;
  }) => Promise<void>;
  adminHandleBulkUpdateFixedPrice: (fixedPrice: number) => Promise<void>;
  adminHandleBulkUpdatePriceBySize: (pricePerSize: number) => Promise<void>;
  adminCalculateTotalPrice: () => number;
  adminCalculateTotalSize: () => number;
}

const useAdminLandsStore = create<AdminLandsStore>((set, get) => ({
  allLandIds: [],
  pageLands: [],
  currentPage: 1,
  totalPages: 1,
  selectedLands: [],

  adminFetchPageLands: async (page = 1) => {
    try {
      const response = await axiosInstance.get(`/admin/manage/lands?page=${page}`);
      set({
        pageLands: Array.isArray(response.data.data) ? response.data.data : [],
        currentPage: response.data.current_page,
        totalPages: response.data.last_page,
      });
    } catch (error) {
      console.error("Failed to fetch lands:", error);
      set({ pageLands: [] });
    }
  },

  adminFetchAllLandIds: async () => {
    try {
      const response = await axiosInstance.get("/admin/manage/lands/all-ids");
      set({ allLandIds: response.data });
    } catch (error) {
      console.error("Failed to fetch all land IDs:", error);
    }
  },

  adminHandleSelectAll: (checked: boolean) => {
    set((state) => ({
      selectedLands: checked ? state.allLandIds : [],
    }));
  },

  adminHandleSelectLand: (id: number) => {
    set((state) => ({
      selectedLands: state.selectedLands.includes(id)
        ? state.selectedLands.filter((landId) => landId !== id)
        : [...state.selectedLands, id],
    }));
  },

  adminHandleBulkCreateAuctions: async (auctionData) => {
  
    try {
      await axiosInstance.post("/admin/manage/lands/bulk-create-auctions", {
        landIds: get().selectedLands,
        ...auctionData,
      });
      toast({
        title: "Success",
        description: "Auctions created successfully",
      });
      set({ selectedLands: [] });
      get().adminFetchPageLands();
      get().adminFetchAllLandIds();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create auctions",
        variant: "destructive",
      });
    }
  },

  adminHandleBulkUpdateFixedPrice: async (fixedPrice: number) => {
    try {
      await axiosInstance.post("/admin/manage/lands/bulk-update-fixed-price", {
        landIds: get().selectedLands,
        fixedPrice: fixedPrice,
      });
      toast({
        title: "Success",
        description: "Lands updated successfully with fixed price",
      });
      set({ selectedLands: [] });
      get().adminFetchPageLands();
      get().adminFetchAllLandIds();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update lands",
        variant: "destructive",
      });
    }
  },

  adminHandleBulkUpdatePriceBySize: async (pricePerSize: number) => {
    try {
      await axiosInstance.post("/admin/manage/lands/bulk-update-price-by-size", {
        landIds: get().selectedLands,
        pricePerSize: pricePerSize,
      });
      toast({
        title: "Success",
        description: "Lands updated successfully with price by size",
      });
      set({ selectedLands: [] });
      get().adminFetchPageLands();
      get().adminFetchAllLandIds();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update lands",
        variant: "destructive",
      });
    }
  },

  adminCalculateTotalPrice: () => {
    return get().selectedLands.reduce((total, landId) => {
      const land = get().pageLands.find((l) => l.id === landId);
      return total + (land?.fixed_price || 0);
    }, 0);
  },

  adminCalculateTotalSize: () => {
    return get().selectedLands.reduce((total, landId) => {
      const land = get().pageLands.find((l) => l.id === landId);
      return total + (land?.size || 0);
    }, 0);
  },
}));

export default useAdminLandsStore;