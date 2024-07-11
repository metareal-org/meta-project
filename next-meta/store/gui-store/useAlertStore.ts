// store/gui-store/useAlertStore.ts
import { create } from "zustand";
import { ReactNode } from "react";

export interface AlertConfig {
  id?: string;
  title?: string;
  picture?: string;
  description?: ReactNode;
  buttons?: {
    disabled?: boolean;
    label: string;
    onClick?: () => void;
    variant?: "default" | "outline" | "link" | "theme" | "destructive" | "secondary" | "ghost" | null | undefined;
  }[];
  closable?: boolean; 
}

export interface AlertStore {
  alertConfigs: AlertConfig[];
  openAlert: (config?: AlertConfig) => string;
  closeAlert: (id: string) => void;
}

const useAlertStore = create<AlertStore>((set) => ({
  alertConfigs: [],
  openAlert: (config) => {
    const id = config?.id || Date.now().toString();
    set((state) => ({
      alertConfigs: [...state.alertConfigs, { ...config, id }],
    }));
    return id;
  },
  closeAlert: (id) =>
    set((state) => ({
      alertConfigs: state.alertConfigs.filter((config) => config.id !== id),
    })),
}));

declare global {
  interface Window {
    openAlert: (config?: AlertConfig) => void;
  }
}
if (typeof window !== "undefined") {
  (window as any).openAlert = useAlertStore.getState().openAlert;
}
export default useAlertStore;
