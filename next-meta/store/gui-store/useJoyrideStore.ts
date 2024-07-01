// store/gui-store/useJoyrideStore.ts
import { create } from "zustand";
import { Step } from "react-joyride";

interface JoyrideStore {
  joyrideSteps: Step[];
  addStep: (step: Step) => void;
  removeStep: (target: string | HTMLElement) => void;
  resetSteps: () => void;
}

const useJoyrideStore = create<JoyrideStore>((set) => ({
  joyrideSteps: [],
  addStep: (step) =>
    set((state) => ({
      joyrideSteps: state.joyrideSteps.some((s) => s.target === step.target) ? state.joyrideSteps : [...state.joyrideSteps, step],
    })),
  removeStep: (target) =>
    set((state) => ({
      joyrideSteps: state.joyrideSteps.filter((step) => step.target !== target),
    })),
  resetSteps: () => set({ joyrideSteps: [] }),
}));

export default useJoyrideStore;
