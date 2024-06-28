import { create } from "zustand";

interface Spinwheel {
  SpinsBalance: number;
  setSpinsBalance: (spinsLeft: number) => void;
  SpinedTimes: number;
  setSpinedTimes: (spinedTimes: number) => void;
  decereaseSpinBalance: () => void;
  showSpinModal: boolean;
  setShowSpinModal: (show: boolean) => void;
}

const useSpinwheelStore = create<Spinwheel>((set) => ({
  SpinsBalance: 1,
  setSpinsBalance: (spinsLeft) => set({ SpinsBalance: spinsLeft }),
  SpinedTimes: 0,
  setSpinedTimes: (spinedTimes) => set({ SpinedTimes: spinedTimes }),
  decereaseSpinBalance: () =>
    set((state) => ({
      SpinsBalance: state.SpinsBalance - 1,
      SpinedTimes: state.SpinedTimes + 1,
    })),
  showSpinModal: false,
  setShowSpinModal: (show) => set({ showSpinModal: show }),
}));

export default useSpinwheelStore;
