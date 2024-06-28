// useLoadingStore.ts
import { create } from "zustand";

interface LoadingState {
  isVisible: boolean;
  text: {
    title: string;
    description: string;
  };
  openLoading: () => void;
  closeLoading: () => void;
  setText: (text: { title: string; description: string }) => void;
}

const useLoadingStore = create<LoadingState>((set) => ({
  isVisible: false,
  text: {
    title: "Please wait",
    description: "",
  },
  openLoading: () => set({ isVisible: true }),
  closeLoading: () => set({ isVisible: false }),
  setText: (text: { title: string; description: string }) => set({ text }),
}));

export default useLoadingStore;
