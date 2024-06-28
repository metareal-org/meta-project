import { create } from "zustand";

export type DrawerNames = "noDrawer" | "buildingDrawer" | "mineDrawer";

type DrawerStates = {
  [key in DrawerNames]: boolean;
};

interface DrawerStore extends DrawerStates {
  setDrawerState: (drawer: DrawerNames, active: boolean) => void;
}
const drawers = {
  noDrawer: false,
  buildingDrawer: false,
  mineDrawer: false,
};
const useDrawerStore = create<DrawerStore>((set) => ({
  ...drawers,
  setDrawerState: (drawer, state) => {
    set({ ...drawers, [drawer]: state });
  },
}));

export default useDrawerStore;
