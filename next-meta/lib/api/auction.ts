// lib/api/auction.ts
import axiosInstance from "../axios-instance";
import { SERVER } from "@/core/constants";

export const createAuction = async (landId: number, minimumPrice: number, duration: number) => {
  const response = await axiosInstance.post("/auctions/create", { land_id: landId, minimum_price: minimumPrice, duration });
  return response.data;
};

export const placeBid = async (auctionId: number, amount: number) => {
  const response = await axiosInstance.post(`/auctions/${auctionId}/bid`, { amount: amount });
  return response;
};

export const fetchBidsForAuction = async (auctionId: number) => {
  const response = await axiosInstance.get(`${SERVER}/auctions/${auctionId}/bids`);
  return response.data;
};

export const cancelAuction = async (auctionId: number) => {
  const response = await axiosInstance.post(`/auctions/${auctionId}/cancel`);
  return response;
};