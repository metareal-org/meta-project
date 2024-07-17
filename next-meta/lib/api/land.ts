import axiosInstance from "../axios-instance";
import { DEBUG, SERVER } from "@/core/constants";
export const fetchLandsFromServer = async (bounds: mapboxgl.LngLatBounds, zoom: number) => {
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

export const fetchLandDetails = async (id: number, signal?: AbortSignal) => {
  try {
    const response = await axiosInstance.get(`${SERVER}/lands/${id}`, { signal });
    return response.data;
  } catch (error) {
    if (axiosInstance.isCancel(error)) {
      DEBUG && console.log("Request canceled:", (error as Error).message);
    }
  }
};
export const fetchUserLands = async () => {
  const response = await axiosInstance.get(`${SERVER}/lands/user`);
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

export const fetchSelectedLandActiveAuction = async (id: number) => {
  try {
    const response = await axiosInstance.get(`${SERVER}/lands/{id}/get-active-auction`);
    return response.data;
  } catch (error) {
    console.error("Error fetching land auctions:", error);
    throw error;
  }
};
