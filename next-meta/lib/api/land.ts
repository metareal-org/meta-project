import axiosInstance from "../axios-instance";
import { SERVER } from "@/core/constants";

export const fetchLands = async (bounds: mapboxgl.LngLatBounds, zoom: number) => {
  const response = await axiosInstance.get(`${SERVER}/lands`, {
    params: {
      bounds: {
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      },
      zoom,
    },
  });
  return response.data;
};

export const fetchLandDetails = async (id: number) => {
  const response = await axiosInstance.get(`${SERVER}/lands/${id}`);
  return response.data;
};

export const setLandPrice = async (id: number, price: number) => {
  const response = await axiosInstance.post(`/lands/${id}/set-price`, { price });
  return response.data;
};

export const updateLandPrice = async (id: number, price: number) => {
  const response = await axiosInstance.post(`/lands/${id}/update-price`, { price });
  return response.data;
};

export const cancelLandSell = async (id: number) => {
  const response = await axiosInstance.post(`/lands/${id}/cancel-sell`);
  return response.data;
};