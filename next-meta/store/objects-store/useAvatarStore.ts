import { create } from "zustand";
import * as THREE from "three";

interface AvatarState {
  avatarModel: any;
  setModel: (model: any) => void;
  isAvatarLoaded: boolean;
  setIsAvatarLoaded: (loaded: boolean) => void;
  worldTranslate: THREE.Vector3;
  setWorldTranslate: (translate: THREE.Vector3) => void;
  quaternion: [THREE.Vector3, number];
  setQuaternion: (quaternion: [THREE.Vector3, number]) => void;
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
  formattedAvatarUrl: string;
  updateFormattedAvatarUrl: () => void;
}

export const DEFAULT_AVATAR = "./assets/models/default-avatar/avatar.glb";

const useAvatarStore = create<AvatarState>((set, get) => ({
  avatarModel: null,
  setModel: (model) => set({ avatarModel: model }),
  isAvatarLoaded: false,
  setIsAvatarLoaded: (loaded) => set({ isAvatarLoaded: loaded }),
  worldTranslate: new THREE.Vector3(0, 0, 0),
  setWorldTranslate: (translate) => set({ worldTranslate: translate }),
  quaternion: [new THREE.Vector3(0, 0, 1), 1.41],
  setQuaternion: (quaternion) => set({ quaternion }),
  avatarUrl: DEFAULT_AVATAR,
  formattedAvatarUrl: DEFAULT_AVATAR.replace(".glb", ".png").split("?")[0] + "?size=600",
  updateFormattedAvatarUrl: () => {
    const { avatarUrl } = get();
    const formatted = avatarUrl.replace(".glb", ".png").split("?")[0] + "?size=600";
    set({ formattedAvatarUrl: formatted });
  },
  
  setAvatarUrl: (url) => {
    set({ avatarUrl: url });
    get().updateFormattedAvatarUrl();
  },
}));

export default useAvatarStore;