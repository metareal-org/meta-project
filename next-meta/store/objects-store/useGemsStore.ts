import { create } from "zustand";
import * as THREE from "three";

interface GemState {
  gemModels: THREE.Object3D[];
  gemPoints: number;
  areGemsLoaded: boolean;
  setAreGemsLoaded: (loaded: boolean) => void;
  addModel: (model: THREE.Object3D) => void;
  removeModel: (model: THREE.Object3D) => void;
  setGemVisibility: (gem: THREE.Object3D, visibility: boolean) => void;
  setAllGemsVisibility: (visibility: boolean) => void;
  increaseGemPoints: () => void;
}

const useGemStore = create<GemState>((set) => ({
  gemModels: [],
  gemPoints: 0,
  areGemsLoaded: false,
  setAreGemsLoaded: (loaded) => set({ areGemsLoaded: loaded }),
  addModel: (model) => set((state) => ({ gemModels: [...state.gemModels, model] })),
  removeModel: (model) =>
    set((state) => ({
      gemModels: state.gemModels.filter((m) => m !== model),
    })),
  setGemVisibility: (gem: THREE.Object3D, visibility: boolean) =>
    set((state) => {
      gem.visible = visibility;
      gem.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.visible = visibility;
        }
      });
      return {
        gemModels: state.gemModels.map((model) => (model === gem ? model : model)),
      };
    }),
  setAllGemsVisibility: (visibility: boolean) =>
    set((state) => {
      state.gemModels.forEach((model) => {
        model.visible = visibility;
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.visible = visibility;
          }
        });
      });
      return { gemModels: [...state.gemModels] };
    }),
  increaseGemPoints: () => set((state) => ({ gemPoints: state.gemPoints + 1 })),
}));

export default useGemStore;
