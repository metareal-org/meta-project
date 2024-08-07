import { create } from "zustand";
import { useUserStore } from './useUserStore';
import axiosInstance from "@/lib/axios-instance";

export type AssetType =
  | 'cp'
  | 'cp_locked'
  | 'meta'
  | 'meta_locked'
  | 'iron'
  | 'wood'
  | 'sand'
  | 'gold'
  | 'giftbox'
  | 'ticket'
  | 'chest_silver'
  | 'chest_gold'
  | 'chest_diamond'
  | 'lottery_scratch';

export interface Asset {
  type: AssetType;
  imgSrc: string;
  className?: string;
  hideInInventory?: boolean;
}

interface AssetStore {
  assets: Asset[];
  getAssetAmount: (type: AssetType) => number;
  updateUserAssets: (assetType: AssetType, amount: number, action: "increase" | "decrease") => Promise<void>;
}

const useAssetStore = create<AssetStore>((set, get) => ({
  assets: [
    { type: 'ticket', imgSrc: '/assets/images/inventory/ticket_icon.webp', className: 'inventory-ticket-target' },
    { type: 'giftbox', imgSrc: '/assets/images/inventory/giftbox_icon.webp', className: 'inventory-gift-target'  },
    { type: 'cp', imgSrc: '/assets/images/tokens/cp.webp', hideInInventory: true },
    { type: 'cp_locked', imgSrc: '/assets/images/tokens/cp_locked.webp', hideInInventory: true },
    { type: 'meta', imgSrc: '/assets/images/tokens/meta.webp', hideInInventory: true },
    { type: 'meta_locked', imgSrc: '/assets/images/tokens/meta_locked.webp', hideInInventory: true },
    { type: 'iron', imgSrc: '/assets/images/inventory/iron_icon.webp' },
    { type: 'wood', imgSrc: '/assets/images/inventory/wood_icon.webp' },
    { type: 'sand', imgSrc: '/assets/images/inventory/sand_icon.webp' },
    { type: 'gold', imgSrc: '/assets/images/inventory/gold_icon.webp' },
    { type: 'chest_silver', imgSrc: '/assets/images/inventory/chest_silver_icon.webp', hideInInventory: true },
    { type: 'chest_gold', imgSrc: '/assets/images/inventory/chest_gold_icon.webp', hideInInventory: true },
    { type: 'chest_diamond', imgSrc: '/assets/images/inventory/chest_diamond_icon.webp', hideInInventory: true },
    { type: 'lottery_scratch', imgSrc: '/assets/images/inventory/lottery_scratch_icon.webp' },
  ],
  getAssetAmount: (type: AssetType) => {
    const user = useUserStore.getState().user;
    if (!user) return 0;
    const asset = user.assets.find(a => a.type === type);
    return asset ? asset.amount : 0;
  },
  updateUserAssets: async (assetType: AssetType, amount: number, action: "increase" | "decrease") => {
    try {
      const response = await axiosInstance.post("/assets/update", {
        asset_type: assetType,
        amount: amount,
        action: action,
      });
      const { fetchUser } = useUserStore.getState();
      await fetchUser();
      return response.data;
    } catch (error) {
      console.error("Failed to update user assets:", error);
      throw error;
    }
  },
}));

export default useAssetStore;