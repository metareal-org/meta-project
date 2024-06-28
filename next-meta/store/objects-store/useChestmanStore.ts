import { create } from "zustand";
import { quadtree } from "d3-quadtree";

const DISTANCE_THRESHOLD = 0.00002;

interface ChestmanState {
  chestmanModel: any | null;
  isReachedToChestman: boolean;
  isChestmanNearby: boolean;
  setModel: (model: any) => void;
  setIsReachedToChestman: (picked: boolean) => void;
  setIsChestmanNearby: (nearby: boolean) => void;
  checkNearbyChestman: (avatarCoordinates: [number, number]) => void;
}

const useChestmanStore = create<ChestmanState>((set, get) => ({
  chestmanModel: null,
  isReachedToChestman: false,
  isChestmanNearby: false,
  setModel: (model) => set(() => ({ chestmanModel: model })),
  setIsReachedToChestman: (picked) => set(() => ({ isReachedToChestman: picked })),
  setIsChestmanNearby: (nearby) => set(() => ({ isChestmanNearby: nearby })),
  checkNearbyChestman: (avatarCoordinates) => {
    const { chestmanModel } = get();
    if (!chestmanModel || get().isReachedToChestman) return;

    const qt = quadtree()
      .x((d: any) => d.coordinates[0])
      .y((d: any) => d.coordinates[1])
      .addAll([chestmanModel]);

    const nearbyChestman = qt.find(avatarCoordinates[0], avatarCoordinates[1], DISTANCE_THRESHOLD) as any;

    if (nearbyChestman && nearbyChestman.visible) {
      set(() => ({ isChestmanNearby: true }));
    } else {
      set(() => ({ isChestmanNearby: false }));
    }
  },
}));

export default useChestmanStore;
