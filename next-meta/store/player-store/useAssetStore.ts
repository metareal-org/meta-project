// store/player-store/useAssetStore.ts
import { create } from "zustand";
import { DEBUG } from "@/core/constants";
import { AssetData, updateUserAssets } from "@/lib/api/asset";
import { fetchUser } from "@/lib/api/user";
import { useUserStore } from "./useUserStore";

interface AssetStore {
  assets: AssetData;
  updateAsset: (assetType: keyof AssetData, amount: number) => Promise<void>;
  setAssets: (assets: AssetData) => void;
}

export const useAssetStore = create<AssetStore>((set) => ({
  assets: {
    gift: 0,
    ticket: 0,
    wood: 0,
    stone: 0,
    sand: 0,
    gold: 0,
  },
  updateAsset: async (assetType, amount) => {
    try {
      const action = amount >= 0 ? "increase" : "decrease";
      const response = await updateUserAssets(assetType, Math.abs(amount), action);

      if (response.assets) {
        set({ assets: response.assets });
        if (DEBUG) {
          console.log("Asset updated:", assetType, amount);
          console.log("New assets state:", response.assets);
        }
        useUserStore.getState().fetchUserData();
        if (DEBUG) {
          console.log("User data refetched after asset update");
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error updating asset:", error);
      set((state) => ({
        assets: {
          ...state.assets,
          [assetType]: Math.max(0, state.assets[assetType] + amount),
        },
      }));
    }
  },
  setAssets: (assets) => set({ assets }),
}));
