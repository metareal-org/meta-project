import axiosInstance from "../axios-instance";
import axios from "axios";

export const updateUserPosition = async (coordinates: [number, number]) => {
  const response = await axiosInstance.post("/user/update/", { coordinates: JSON.stringify(coordinates) });
  return response.data;
};

export const updateUserBalance = async (cpAmount: number, metaAmount: number) => {
  const response = await axiosInstance.post("/user/update/", { cp_amount: cpAmount, meta_amount: metaAmount });
  return response.data;
};

export const fetchOutfitGender = async (avatarUrl: string) => {
  const response = await axios.get(`${avatarUrl.replace(".glb", "").split("?")[0]}.json`);
  return response.data.outfitGender;
};


export const updateUserMission = async (missionId: number) => {
  const response = await axiosInstance.post("user/update/", {
    current_mission: missionId,
  });
  return response.data;
};

export const updateUserAvatar = async (avatarUrl: string) => {
  const response = await axiosInstance.post("user/update/", {
    avatar_url: avatarUrl,
  });
  return response.data;
};

export const updateUserNickname = async (nickname: string) => {
  const response = await axiosInstance.post("user/update/", {
    nickname: nickname,
  });
  return response.data;
};