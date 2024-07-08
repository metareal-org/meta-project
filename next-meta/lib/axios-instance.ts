import axios from "axios";
import Cookies from "js-cookie";
import { SERVER } from "@/core/constants";
const axiosInstance = axios.create({
  baseURL: SERVER,
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      // config.headers.Authorization = `${token}`;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
