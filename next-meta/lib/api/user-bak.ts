// lib/api/user.ts

import { DEBUG } from "@/core/constants";
import axiosInstance from "../axios-instance";
import axios from "axios";
import { User } from "@/store/player-store/useUserStore";

// Types
type Coordinates = [number, number];
type CpMetaAction = "add" | "remove" | "lock" | "unlock" | "setExact";
interface UserUpdateResponse {
  message: string;
  user: User;
  data: any;
}

interface OutfitGenderResponse {
  outfitGender: string;
}

// API Functions
export const apiFetchUser = async (): Promise<User | undefined> => {
  try {
    const response = await axiosInstance.get("/user/show");
    return response.data.user;
  } catch (error) {
    if (axiosInstance.isCancel(error)) {
      DEBUG && console.log("Request canceled:", (error as Error).message);
    }
  }
};

export const apiFetchOutfitGender = async (avatarUrl: string): Promise<string> => {
  const response = await axios.get<OutfitGenderResponse>(`${avatarUrl.replace(".glb", "").split("?")[0]}.json`);
  return response.data.outfitGender;
};

export const apiUpdateUserPosition = async (coordinates: Coordinates): Promise<UserUpdateResponse> => {
  const response = await axiosInstance.post<UserUpdateResponse>("/user/update/", { coordinates: JSON.stringify(coordinates) });
  return response.data;
};

export const apiUpdateCpAmount = async (action: CpMetaAction, amount: number): Promise<UserUpdateResponse> => {
  const response = await axiosInstance.post<UserUpdateResponse>("/user/update-cp-amount/", { action, amount });
  return response.data;
};

export const apiUpdateMetaAmount = async (action: CpMetaAction, amount: number): Promise<UserUpdateResponse> => {
  const response = await axiosInstance.post<UserUpdateResponse>("/user/update-meta-amount/", { action, amount });
  return response.data;
};

export const apiUpdateUserMission = async (missionId: number): Promise<UserUpdateResponse> => {
  const response = await axiosInstance.post<UserUpdateResponse>("user/update/", {
    current_mission: missionId,
  });
  return response.data;
};

export const apiUpdateUserAvatar = async (avatarUrl: string): Promise<UserUpdateResponse> => {
  const response = await axiosInstance.post<UserUpdateResponse>("user/update/", {
    avatar_url: avatarUrl,
  });
  return response.data;
};

export const apiUpdateUserNickname = async (nickname: string): Promise<UserUpdateResponse> => {
  const response = await axiosInstance.post<UserUpdateResponse>("user/update/", {
    nickname: nickname,
  });
  return response.data;
};

export const apiApplyReferralCode = async (referralCode: string) => {
  try {
    const response = await axiosInstance.post("user/apply-referral", { referral_code: referralCode });
    response.data.referralApplied = true;
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error);
    } else {
      throw new Error("An error occurred while applying the referral code");
    }
  }
};
