import { create } from "zustand";

export const drawerNames = ["noDrawer", "buildingDrawer", "mineDrawer", "inventoryDrawer", "mylandsDrawer", "myOffersDrawer"] as const;
export type DrawerName = (typeof drawerNames)[number];

type DrawerStates = Record<DrawerName, boolean>;

interface DrawerStore extends DrawerStates {
  setDrawerState: (drawer: DrawerName, active: boolean) => void;
  resetDrawers: () => void;
  activeDrawer: DrawerName | null;
}

const initialDrawerStates: DrawerStates = Object.fromEntries(drawerNames.map((name) => [name, false])) as DrawerStates;

const useDrawerStore = create<DrawerStore>((set, get) => ({
  ...initialDrawerStates,
  activeDrawer: null,
  setDrawerState: (drawer, active) =>
    set((state) => ({
      ...Object.fromEntries(drawerNames.map((name) => [name, false])),
      [drawer]: active,
      activeDrawer: active ? drawer : null,
    })),
  resetDrawers: () => set({ ...initialDrawerStates, activeDrawer: null }),
}));

export default useDrawerStore;
