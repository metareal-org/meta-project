// store\objects-store\useFobStore.ts
import { create } from "zustand";
import { quadtree } from "d3-quadtree";

const DISTANCE_THRESHOLD = 0.00002;

interface FobState {
  fobModel: any | null;
  isFobPickedUp: boolean;
  isFobNearby: boolean;
  isFobLoaded: boolean;
  setIsFobLoaded: (loaded: boolean) => void;
  setModel: (model: any) => void;
  setFobPickedUp: (picked: boolean) => void;
  setIsFobNearby: (nearby: boolean) => void;
  checkNearbyFob: (avatarCoordinates: [number, number]) => void;
}

const useFobStore = create<FobState>((set, get) => ({
  fobModel: null,
  isFobPickedUp: false,
  isFobNearby: false,
  isFobLoaded: false,
  setIsFobLoaded: (loaded) => {
    set(() => ({ isFobLoaded: loaded }));
  },
  setModel: (model) => set(() => ({ fobModel: model })),
  setFobPickedUp: (picked) => set(() => ({ isFobPickedUp: picked })),
  setIsFobNearby: (nearby) => set(() => ({ isFobNearby: nearby })),
  checkNearbyFob: (avatarCoordinates) => {
    const { fobModel } = get();
    if (!fobModel || get().isFobPickedUp) return;

    const qt = quadtree()
      .x((d: any) => d.coordinates[0])
      .y((d: any) => d.coordinates[1])
      .addAll([fobModel]);

    const nearbyFob = qt.find(avatarCoordinates[0], avatarCoordinates[1], DISTANCE_THRESHOLD) as any;

    if (nearbyFob && nearbyFob.visible) {
      set(() => ({ isFobNearby: true }));
    } else {
      set(() => ({ isFobNearby: false }));
    }
  },
}));

export default useFobStore;
