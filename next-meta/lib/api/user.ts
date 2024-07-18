import { DEBUG } from "@/core/constants";
import axiosInstance from "../axios-instance";
import axios from "axios";

// Types
type Coordinates = [number, number];

type CpMetaAction = "add" | "remove" | "lock" | "unlock" | "setExact";

interface UserUpdateResponse {
  data: {
    message: string;
    user: UserData;
  };
}
interface UserData {
  id: number;
  address: string;
  nickname: string | null;
  avatar_url: string | null;
  cp_amount_free: number;
  cp_amount_locked: number;
  meta_amount_free: number;
  meta_amount_locked: number;
  coordinates: Coordinates | null;
  current_mission: number;
  created_at: string;
  updated_at: string;
}

interface OutfitGenderResponse {
  outfitGender: string;
}

// API Functions
export const fetchUser = async (): Promise<UserData> => {
  const response = await axiosInstance.get<UserData>("/user/show");
  DEBUG && console.log(response);
  return response.data;
};

export const fetchOutfitGender = async (avatarUrl: string): Promise<string> => {
  const response = await axios.get<OutfitGenderResponse>(`${avatarUrl.replace(".glb", "").split("?")[0]}.json`);
  return response.data.outfitGender;
};

export const updateUserPosition = async (coordinates: Coordinates): Promise<UserUpdateResponse> => {
  const response = await axiosInstance.post<UserUpdateResponse>("/user/update/", { coordinates: JSON.stringify(coordinates) });
  return response.data;
};

export const updateCpAmount = async (action: CpMetaAction, amount: number): Promise<UserUpdateResponse> => {
  const response = await axiosInstance.post<UserUpdateResponse>("/user/update-cp-amount/", { action, amount });
  return response.data;
};

export const updateMetaAmount = async (action: CpMetaAction, amount: number): Promise<UserUpdateResponse> => {
  const response = await axiosInstance.post<UserUpdateResponse>("/user/update-meta-amount/", { action, amount });
  return response.data;
};

export const updateUserMission = async (missionId: number): Promise<UserUpdateResponse> => {
  const response = await axiosInstance.post<UserUpdateResponse>("user/update/", {
    current_mission: missionId,
  });
  return response.data;
};

export const updateUserAvatar = async (avatarUrl: string): Promise<UserUpdateResponse> => {
  const response = await axiosInstance.post<UserUpdateResponse>("user/update/", {
    avatar_url: avatarUrl,
  });
  return response.data;
};

export const updateUserNickname = async (nickname: string): Promise<UserUpdateResponse> => {
  const response = await axiosInstance.post<UserUpdateResponse>("user/update/", {
    nickname: nickname,
  });
  return response.data;
};

export const applyReferralCode = async (referralCode: string) => {
  try {
    const response = await axiosInstance.post('user/apply-referral', { referral_code: referralCode });
    response.data.referralApplied = true;
    return response.data;
  } catch (error:any) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error);
    } else {
      throw new Error('An error occurred while applying the referral code');
    }
  }
};

