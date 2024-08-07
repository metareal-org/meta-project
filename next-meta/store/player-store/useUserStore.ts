import { create } from "zustand";
import { DEBUG } from "../../core/constants";
import axiosInstance from "@/lib/axios-instance";

export interface UserAsset {
  id: number;
  user_id: number;
  type: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  address: string;
  nickname: string;
  avatar_url: string;
  coordinates: string | null;
  current_mission: number;
  referrer_id: number | null;
  referral_code: string;
  remember_token: string | null;
  created_at: string;
  updated_at: string;
  assets: UserAsset[];
}

export interface UserState {
  user: User | null;
  outfitGender: string | null;
  fetchUser: () => Promise<User | null>;
  fetchOutfitGender: (avatarUrl: string) => Promise<string>;
  updateUserNickname: (nickname: string) => Promise<void>;
  updateUserMission: (missionId: number) => Promise<void>;
  updateUserAvatar: (avatarUrl: string) => Promise<void>;
  getAssetAmount: (assetType: string) => number;
  getTotalAssetAmount: (assetTypes: string[]) => number;
  updateAssetAmount: (assetType: string, amount: number) => void;
  applyReferralCode: (referralCode: string) => Promise<any>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  outfitGender: null,

  fetchUser: async () => {
    try {
      const response = await axiosInstance.get("/user/show");
      const userData = response.data.user;
      set({ user: userData });
      return userData;
    } catch (error) {
      DEBUG && console.error("Failed to fetch user:", error);
      return null;
    }
  },

  fetchOutfitGender: async (avatarUrl: string): Promise<string> => {
    try {
      const response = await axiosInstance.get<{ outfitGender: string }>(`${avatarUrl.replace(".glb", "").split("?")[0]}.json`);
      const gender = response.data.outfitGender;
      set({ outfitGender: gender });
      return gender;
    } catch (error) {
      DEBUG && console.error("Failed to fetch outfit gender:", error);
      set({ outfitGender: "" });
      return "";
    }
  },

  updateUserNickname: async (nickname: string) => {
    try {
      await axiosInstance.post("/user/update", { nickname });
      await get().fetchUser();
    } catch (error) {
      DEBUG && console.error("Failed to update user nickname:", error);
    }
  },

  updateUserMission: async (missionId: number) => {
    try {
      await axiosInstance.post("/user/update", { current_mission: missionId });
      await get().fetchUser();
    } catch (error) {
      DEBUG && console.error("Failed to update user mission:", error);
    }
  },

  updateUserAvatar: async (avatarUrl: string) => {
    try {
      await axiosInstance.post("/user/update", { avatar_url: avatarUrl });
      await get().fetchUser();
    } catch (error) {
      DEBUG && console.error("Failed to update user avatar:", error);
    }
  },

  getAssetAmount: (assetType: string): number => {
    const user = get().user;
    if (!user) return 0;
    const asset = user.assets.find((a) => a.type === assetType);
    return asset ? asset.amount : 0;
  },

  getTotalAssetAmount: (assetTypes: string[]): number => {
    const user = get().user;
    if (!user) return 0;
    return assetTypes.reduce((total, type) => {
      const asset = user.assets.find((a) => a.type === type);
      return total + (asset ? asset.amount : 0);
    }, 0);
  },

  updateAssetAmount: (assetType: string, amount: number) => {
    set((state) => {
      if (!state.user) return state;
      const updatedAssets = state.user.assets.map((asset) => (asset.type === assetType ? { ...asset, amount } : asset));
      return { user: { ...state.user, assets: updatedAssets } };
    });
  },

  applyReferralCode: async (referralCode: string) => {
    try {
      const response = await axiosInstance.post("/user/apply-referral", { referral_code: referralCode });
      return response.data;
    } catch (error) {
      DEBUG && console.error("Failed to apply referral code:", error);
      throw error;
    }
  },
}));