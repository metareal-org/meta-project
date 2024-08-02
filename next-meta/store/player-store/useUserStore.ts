import { create } from "zustand";
import { DEBUG } from "../../core/constants";
import { UserAsset } from "@/lib/api/asset";
import { apiFetchOutfitGender, apiFetchUser, apiUpdateUser } from "@/lib/api/user";

export interface User {
  id: number;
  address: string;
  nickname: string;
  avatar_url: string;
  coordinates: string;
  current_mission: number | null;
  referrer_id: number | null;
  referral_code: string;
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
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  outfitGender: null,

  fetchUser: async () => {
    try {
      const response = await apiFetchUser();
      set({ user: response || null });
      return response || null;
    } catch (error) {
      DEBUG && console.error("Failed to fetch user:", error);
      return null;
    }
  },

  fetchOutfitGender: async (avatarUrl: string): Promise<string> => {
    try {
      const gender = await apiFetchOutfitGender(avatarUrl);
      set({ outfitGender: gender });
      console.log(gender);
      return gender;
    } catch (error) {
      DEBUG && console.error("Failed to fetch outfit gender:", error);
      set({ outfitGender: "" });
      return "";
    }
  },

  updateUserNickname: async (nickname: string) => {
    try {
      await apiUpdateUser({ nickname });
      await get().fetchUser();
    } catch (error) {
      DEBUG && console.error("Failed to update user nickname:", error);
    }
  },

  updateUserMission: async (missionId: number) => {
    try {
      await apiUpdateUser({ current_mission: missionId });
      await get().fetchUser();
    } catch (error) {
      DEBUG && console.error("Failed to update user mission:", error);
    }
  },

  updateUserAvatar: async (avatarUrl: string) => {
    try {
      await apiUpdateUser({ avatar_url: avatarUrl });
      await get().fetchUser();
    } catch (error) {
      DEBUG && console.error("Failed to update user avatar:", error);
    }
  },
}));
