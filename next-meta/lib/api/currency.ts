import axiosInstance from "../axios-instance";

interface CurrencyResponse {
  balance: number;
}

export const apiFetchBalance = async (userId: number, type: 'cp' | 'meta'): Promise<number> => {
  const response = await axiosInstance.get<CurrencyResponse>(`/currency/${userId}/${type}`);
  return response.data.balance;
};

export const apiLockCurrency = async (type: 'cp' | 'meta', amount: number): Promise<CurrencyResponse> => {
  const response = await axiosInstance.post<CurrencyResponse>("/currency/lock", { type, amount });
  return response.data;
};

export const apiUnlockCurrency = async (type: 'cp' | 'meta', amount: number): Promise<CurrencyResponse> => {
  const response = await axiosInstance.post<CurrencyResponse>("/currency/unlock", { type, amount });
  return response.data;
};

export const apiAddCurrency = async (type: 'cp' | 'meta', amount: number): Promise<CurrencyResponse> => {
  const response = await axiosInstance.post<CurrencyResponse>("/currency/add", { type, amount });
  return response.data;
};

export const apiSubtractCurrency = async (type: 'cp' | 'meta', amount: number): Promise<CurrencyResponse> => {
  const response = await axiosInstance.post<CurrencyResponse>("/currency/subtract", { type, amount });
  return response.data;
};