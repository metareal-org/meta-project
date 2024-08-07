import { create } from "zustand";
import axiosInstance from "@/lib/axios-instance";
import { useUserStore } from "./useUserStore";
import useLandStore from "../world-store/useLandStore";

interface TransactionStore {
  buyingLand: boolean;
  buyLand: (landId: number) => Promise<void>;
}

const useTransactionStore = create<TransactionStore>((set) => ({
  buyingLand: false,
  buyLand: async (landId: number) => {
    const userStore = useUserStore.getState();
    const landStore = useLandStore.getState();
    set({ buyingLand: true });
    try {
      const response = await axiosInstance.post(`/lands/${landId}/buy`);
      await userStore.fetchUser();
      await landStore.fetchLandDetails(landId);
      console.log("Land purchased successfully:", response.data);
    } catch (error) {
      console.error("Error buying land:", error);
    } finally {
      set({ buyingLand: false });
    }
  },
}));

export default useTransactionStore;