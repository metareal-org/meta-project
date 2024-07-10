import axiosInstance from "../axios-instance";
import { SERVER } from "@/core/constants";

export const submitOffer = async (landId: number, price: number) => {
  const response = await axiosInstance.post("/offers/submit", { land_id: landId, price });
  return response.data;
};

export const updateOffer = async (offerId: number, price: number) => {
  const response = await axiosInstance.post(`/offers/update/${offerId}`, { price });
  return response.data;
};

export const fetchOffers = async (landId: number) => {
  const response = await axiosInstance.get(`${SERVER}/offers/${landId}`);
  return response.data;
};

export const deleteOffer = async (offerId: number) => {
  const response = await axiosInstance.post(`/offers/delete/${offerId}`);
  return response.data;
};

export const fetchUserOffers = async () => {
  const response = await axiosInstance.post(`${SERVER}/offers/user`);
  return response.data;
};

export const acceptOffer = async (offerId: number) => {
  const response = await axiosInstance.post(`/offers/accept/${offerId}`);
  return response.data;
};