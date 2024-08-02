import axiosInstance from "../axios-instance";
import { SERVER } from "@/core/constants";

export const apiSubmitOffer = async (landId: number, price: number) => {
  const response = await axiosInstance.post("/offers/submit", { land_id: landId, price });
  return response.data;
};

export const apiUpdateOffer = async (offerId: number, price: number) => {
  const response = await axiosInstance.post(`/offers/update/${offerId}`, { price });
  return response.data;
};


export const apiFetchOffers = async (landId: number) => {
  const response = await axiosInstance.get(`${SERVER}/offers/${landId}`);
  return response.data;
};
export const apiDeleteOffer = async (offerId: number) => {
  const response = await axiosInstance.post(`/offers/delete/${offerId}`);
  return response.data;
};

export const apiFetchuser_offers = async () => {
  const response = await axiosInstance.post(`${SERVER}/offers/user`);
  return response.data;
};

export const apiAcceptOffer = async (offerId: number) => {
  const response = await axiosInstance.post(`/offers/accept/${offerId}`);
  return response.data;
};
