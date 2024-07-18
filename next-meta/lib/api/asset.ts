// lib/api/asset.ts
import axiosInstance from "../axios-instance";

export interface AssetData {
  gift: number;
  ticket: number;
  wood: number;
  stone: number;
  sand: number;
  gold: number;
}

interface AssetUpdateResponse {
  message: string;
  assets: AssetData;
}

export const updateUserAssets = async (
  assetType: keyof AssetData, 
  amount: number, 
  action: 'increase' | 'decrease'
): Promise<AssetUpdateResponse> => {
  const response = await axiosInstance.post<AssetUpdateResponse>("/assets/update", {
    asset_type: assetType,
    amount: amount,
    action: action
  });
  return response.data;
};