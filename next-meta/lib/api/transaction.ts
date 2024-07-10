import axiosInstance from "../axios-instance";

export const buyLand = async (landId: number) => {
  const response = await axiosInstance.post(`/lands/${landId}/buy`);
  return response.data;
};