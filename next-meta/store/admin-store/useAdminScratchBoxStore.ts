import { create } from "zustand";
import axiosInstance from "@/lib/axios-instance";
import { toast } from "@/components/ui/use-toast";

interface AdminScratchBoxStore {
  adminScratchBoxes: any[];
  adminPageAvailableLandsForScratchBox: any[];
  currentPage: number;
  totalPages: number;
  adminFetchScratchBoxes: () => Promise<void>;
  adminFetchPageAvailableLandsForScratchBox: (page?: number) => Promise<void>;
  adminCreateScratchBox: (name: string, landIds: number[]) => Promise<void>;
  adminDeleteScratchBox: (id: number) => Promise<void>;
  adminSelectAllPages: () => Promise<number[]>;
}

const useAdminScratchBoxStore = create<AdminScratchBoxStore>((set, get) => ({
  adminScratchBoxes: [],
  adminPageAvailableLandsForScratchBox: [],
  currentPage: 1,
  totalPages: 1,

  adminFetchScratchBoxes: async () => {
    try {
      const response = await axiosInstance.get("/admin/scratch-boxes");
      set({ adminScratchBoxes: response.data.data });
    } catch (error) {
      console.error("Failed to fetch scratch boxes:", error);
      set({ adminScratchBoxes: [] });
    }
  },

  adminFetchPageAvailableLandsForScratchBox: async (page = 1) => {
    try {
      const response = await axiosInstance.get(`/admin/scratch-boxes/available-lands?page=${page}`);
      set({ 
        adminPageAvailableLandsForScratchBox: response.data.data,
        currentPage: response.data.current_page,
        totalPages: response.data.last_page
      });
    } catch (error) {
      console.error("Failed to fetch available lands for scratch box:", error);
      set({ adminPageAvailableLandsForScratchBox: [], currentPage: 1, totalPages: 1 });
    }
  },

  adminCreateScratchBox: async (name: string, landIds: number[]) => {
    try {
      await axiosInstance.post("/admin/scratch-boxes", {
        name: name,
        land_ids: landIds,
      });
      toast({
        title: "Success",
        description: "Scratch box created successfully",
      });
      await get().adminFetchScratchBoxes();
      await get().adminFetchPageAvailableLandsForScratchBox();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create scratch box",
        variant: "destructive",
      });
      throw error;
    }
  },

  adminDeleteScratchBox: async (id: number) => {
    try {
      await axiosInstance.delete(`/admin/scratch-boxes/${id}`);
      toast({
        title: "Success",
        description: "Scratch box deleted successfully",
      });
      await get().adminFetchScratchBoxes();
      await get().adminFetchPageAvailableLandsForScratchBox();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete scratch box",
        variant: "destructive",
      });
      throw error;
    }
  },

  adminSelectAllPages: async () => {
    try {
      const response = await axiosInstance.get("/admin/scratch-boxes/all-available-land-ids");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch all land IDs:", error);
      toast({
        title: "Error",
        description: "Failed to select all lands",
        variant: "destructive",
      });
      throw error;
    }
  },
}));

export default useAdminScratchBoxStore;