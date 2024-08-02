import { DEBUG } from "@/core/constants";
import axiosInstance from "../axios-instance";

export interface User {
  id: number;
  address: string;
  nickname: string;
  avatar_url: string;
  coordinates: string;
  current_mission: number | null;
  referrer_id: number | null;
  referral_code: string;
  assets: any;
}

export const apiFetchUser = async (): Promise<User | undefined> => {
  try {
    const response = await axiosInstance.get("/user/show");
    return response.data.user;
  } catch (error) {
    DEBUG && console.log("Error fetching user:", error);
  }
};
export const apiFetchOutfitGender = async (avatarUrl: string): Promise<string> => {
  const response = await axiosInstance.get<{ outfitGender: string }>(`${avatarUrl.replace(".glb", "").split("?")[0]}.json`);
  return response.data.outfitGender;
};


export const apiUpdateUser = async (updateData: Partial<User>): Promise<User> => {
  const response = await axiosInstance.post("/user/update", updateData);
  return response.data.user;
};

export const apiApplyReferralCode = async (referralCode: string): Promise<{ message: string }> => {
  const response = await axiosInstance.post("/user/apply-referral", { referral_code: referralCode });
  return response.data;
};

export const apiFetchReferralTree = async (): Promise<any> => {
  const response = await axiosInstance.get("/user/referral-tree");
  return response.data;
};

export const apiFetchReferralCode = async (): Promise<{ referral_code: string }> => {
  const response = await axiosInstance.get("/user/referral-code");
  return response.data;
};
