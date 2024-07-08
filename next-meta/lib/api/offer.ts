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