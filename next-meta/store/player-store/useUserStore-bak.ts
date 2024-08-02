// store/player-store/useUserStore.ts

import { create } from "zustand";
import { DEBUG } from "../../core/constants";
import {
  apiFetchUser,
  apiUpdateCpAmount,
  apiUpdateMetaAmount,
  apiUpdateUserPosition,
  apiUpdateUserMission,
  apiUpdateUserAvatar,
  apiUpdateUserNickname,
  apiApplyReferralCode,
  apiFetchOutfitGender,
} from "@/lib/api/user";
import { AssetData } from "@/lib/api/asset";

export interface User {
  assets: AssetData;
  id: number;
  address: string;
  avatar_url: string;
  coordinates: string | null;
  cp_amount_free: number;
  cp_amount_locked: number;
  created_at: string;
  current_mission: number;
  meta_amount_free: number;
  meta_amount_locked: number;
  nickname: string;
  remember_token: null | string;
  updated_at: string;
}

export type CpMetaAction = "add" | "remove" | "lock" | "unlock" | "setExact";
type Coordinates = [number, number];

export interface UserState {
  user: User | null;
  outfitGender: string | null;
  setUser: (user: User) => void;
  cpAmount: {
    free: number;
    locked: number;
    total: number;
  };
  metaAmount: {
    free: number;
    locked: number;
    total: number;
  };
  updateCpAmount: (action: CpMetaAction, amount: number) => Promise<any>;
  updateMetaAmount: (action: CpMetaAction, amount: number) => Promise<any>;
  updateUserPosition: (coordinates: Coordinates) => Promise<any>;
  updateUserMission: (missionId: number) => Promise<any>;
  updateUserAvatar: (avatarUrl: string) => Promise<any>;
  updateUserNickname: (nickname: string) => Promise<any>;
  applyReferralCode: (referralCode: string) => Promise<any>;
  fetchOutfitGender: (avatarUrl: string) => Promise<string>;
  fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  outfitGender: null,
  setUser: (user) => set({ user }),
  cpAmount: {
    free: 0,
    locked: 0,
    total: 0,
  },
  metaAmount: {
    free: 0,
    locked: 0,
    total: 0,
  },
  updateCpAmount: async (action: CpMetaAction, amount: number) => {
    try {
      const response = await apiUpdateCpAmount(action, amount);
      set((state) => ({
        user: {
          ...state.user,
          ...response.user,
        } as User,
        cpAmount: {
          free: response.user.cp_amount_free,
          locked: response.user.cp_amount_locked,
          total: response.user.cp_amount_free + response.user.cp_amount_locked,
        },
      }));
      return response.data;
    } catch (error) {
      DEBUG && console.error("Failed to update user CP amount:", error);
      throw error;
    }
  },
  updateMetaAmount: async (action: CpMetaAction, amount: number) => {
    try {
      const response = await apiUpdateMetaAmount(action, amount);
      set((state) => ({
        user: {
          ...state.user,
          ...response.user,
        } as User,
        metaAmount: {
          free: response.user.meta_amount_free,
          locked: response.user.meta_amount_locked,
          total: response.user.meta_amount_free + response.user.meta_amount_locked,
        },
      }));
      return response.data;
    } catch (error) {
      DEBUG && console.error("Failed to update user META amount:", error);
      throw error;
    }
  },
  updateUserPosition: async (coordinates: Coordinates) => {
    try {
      const response = await apiUpdateUserPosition(coordinates);
      set((state) => ({
        user: {
          ...state.user,
          ...response.user,
        } as User,
      }));
      return response.data;
    } catch (error) {
      DEBUG && console.error("Failed to update user position:", error);
      throw error;
    }
  },
  updateUserMission: async (missionId: number) => {
    try {
      const response = await apiUpdateUserMission(missionId);
      set((state) => ({
        user: {
          ...state.user,
          ...response.user,
        } as User,
      }));
      return response.data;
    } catch (error) {
      DEBUG && console.error("Failed to update user mission:", error);
      throw error;
    }
  },
  updateUserAvatar: async (avatarUrl: string) => {
    try {
      const response = await apiUpdateUserAvatar(avatarUrl);
      set((state) => ({
        user: {
          ...state.user,
          ...response.user,
        } as User,
      }));
      return response.data;
    } catch (error) {
      DEBUG && console.error("Failed to update user avatar:", error);
      throw error;
    }
  },
  updateUserNickname: async (nickname: string) => {
    try {
      const response: any = await apiUpdateUserNickname(nickname);
      set((state) => ({
        user: {
          ...state.user,
          ...response.user,
        } as User,
      }));
      return response.user;
    } catch (error) {
      DEBUG && console.error("Failed to update user nickname:", error);
      throw error;
    }
  },
  applyReferralCode: async (referralCode: string) => {
    try {
      const response = await apiApplyReferralCode(referralCode);
      return response;
    } catch (error) {
      DEBUG && console.error("Failed to apply referral code:", error);
      throw error;
    }
  },
  fetchOutfitGender: async (avatarUrl: string) => {
    try {
      const gender = await apiFetchOutfitGender(avatarUrl);
      set({ outfitGender: gender });
      return gender;
    } catch (error) {
      DEBUG && console.error("Failed to fetch outfit gender:", error);
      throw error;
    }
  },
  fetchUser: async () => {
    try {
      const userData = await apiFetchUser();
      if (!userData) return;
      set({
        user: userData,
        cpAmount: {
          free: userData.cp_amount_free,
          locked: userData.cp_amount_locked,
          total: userData.cp_amount_free + userData.cp_amount_locked,
        },
        metaAmount: {
          free: userData.meta_amount_free,
          locked: userData.meta_amount_locked,
          total: userData.meta_amount_free + userData.meta_amount_locked,
        },
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  },
}));
