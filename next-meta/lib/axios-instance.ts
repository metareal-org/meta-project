import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";
import { SERVER } from "@/core/constants";

interface CustomAxiosInstance extends AxiosInstance {
  isCancel: (value: any) => boolean;
}
const axiosInstance = axios.create({
  baseURL: SERVER,
}) as CustomAxiosInstance;

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.isCancel = axios.isCancel;

export default axiosInstance;
