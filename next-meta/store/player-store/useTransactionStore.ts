import { create } from "zustand";
import { buyLand } from "@/lib/api/transaction";
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
      const result = await buyLand(landId);

      // Update user's CP balance
      userStore.fetchUserBalance();

      // Re-fetch land details
      await landStore.fetchLandDetails(landId);

      // You might want to show a success message here
      console.log("Land purchased successfully:", result);
    } catch (error) {
      console.error("Error buying land:", error);
      // You might want to show an error message here
    } finally {
      set({ buyingLand: false });
    }
  },
}));

export default useTransactionStore;
