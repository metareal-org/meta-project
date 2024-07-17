import axiosInstance from "../axios-instance";
import { SERVER } from "@/core/constants";

export const submitBid = async (landId: number, price: number) => {
  const response = await axiosInstance.post("/bids/submit", { land_id: landId, price });
  return response.data;
};

export const updateBid = async (bidId: number, price: number) => {
  const response = await axiosInstance.post(`/bids/update/${bidId}`, { price });
  return response.data;
};

export const fetchBids = async (landId: number) => {
  const response = await axiosInstance.get(`${SERVER}/bids/${landId}`);
  return response.data;
};

export const deleteBid = async (bidId: number) => {
  const response = await axiosInstance.post(`/bids/delete/${bidId}`);
  return response.data;
};

export const fetchuser_bids = async () => {
  const response = await axiosInstance.post(`${SERVER}/bids/user`);
  return response.data;
};

export const acceptBid = async (bidId: number) => {
  const response = await axiosInstance.post(`/bids/accept/${bidId}`);
  return response.data;
};
