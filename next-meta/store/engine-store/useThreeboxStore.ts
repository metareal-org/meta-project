import { create } from "zustand";
export interface ThreeboxStore {
  threebox: any;
  setThreebox: (tb: any) => void;
}
const useThreeboxStore = create((set) => ({
  threebox: null,
  setThreebox: (tb: any) => set({ threebox: tb }),
}));

export default useThreeboxStore;
