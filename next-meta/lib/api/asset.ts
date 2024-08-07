import axiosInstance from "../axios-instance";

export interface UserAsset {
  type: string;
  amount: number;
}

export interface AssetData {
  cp: number;
  cp_locked: number;
  meta: number;
  meta_locked: number;
  iron: number;
  wood: number;
  sand: number;
  gold: number;
  chest_silver: number;
  chest_gold: number;
  chest_diamond: number;
  lottery_scratch: number;
}

interface AssetUpdateResponse {
  message: string;
  assets: AssetData;
}

export const apiUpdateUserAssets = async (assetType: keyof AssetData, amount: number, action: "increase" | "decrease"): Promise<AssetUpdateResponse> => {
  const response = await axiosInstance.post<AssetUpdateResponse>("/assets/update", {
    asset_type: assetType,
    amount: amount,
    action: action,
  });
};
 
export const apiFetchUserAssets = async (): Promise<AssetData> => {
  const response = await axiosInstance.get<AssetData>("/assets");
  return response.data;
};
