import { create } from "zustand";
import * as THREE from "three";

interface CarState {
  carModel: any;
  setModel: (model: any) => void;
  isCarLoaded: boolean;
  setIsCarLoaded: (isLoaded: boolean) => void;
  worldTranslate: THREE.Vector3;
  setWorldTranslate: (translate: THREE.Vector3) => void;
  quaternion: [THREE.Vector3, number];
  setQuaternion: (quaternion: [THREE.Vector3, number]) => void;
}

const useCarStore = create<CarState>((set) => ({
  carModel: null,
  setModel: (model) => set({ carModel: model }),
  isCarLoaded: false,
  setIsCarLoaded: (loaded) => set({ isCarLoaded: loaded }),
  worldTranslate: new THREE.Vector3(0, 0, 0),
  setWorldTranslate: (translate) => set({ worldTranslate: translate }),
  quaternion: [new THREE.Vector3(0, 0, 1), 1.41],
  setQuaternion: (quaternion) => set({ quaternion }),
}));

export default useCarStore;
