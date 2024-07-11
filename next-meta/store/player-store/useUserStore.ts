import { fetchUser } from "@/lib/api/user";
import { create } from "zustand";


export interface User {
  id: number;
  address: string;
  avatar_url: string;
  coordinates: string;
  cp_amount_free: number;
  cp_amount_locked: number;
  created_at: string;
  current_mission: number;
  meta_amount_free: number;
  meta_amount_locked: number;
  nickname: string;
  remember_token: null | string;
  updated_at: string;
}


export interface UserState {
  user: User | null;
  nickname: string;
  setNickname: (nickname: string) => void;
  setUser: (user: any) => void;
  cpAmount: {
    free: number;
    locked: number;
    total: number;
  };
  metaAmount: {
    free: number;
    locked: number;
    total: number;
  };
  addCp: (amount: number) => void;
  removeCp: (amount: number) => void;
  lockCp: (amount: number) => void;
  unlockCp: (amount: number) => void;
  addMeta: (amount: number) => void;
  removeMeta: (amount: number) => void;
  lockMeta: (amount: number) => void;
  unlockMeta: (amount: number) => void;
  setCpExact: (amount: number) => void;
  setMetaExact: (amount: number) => void;
  fetchUserBalance: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  nickname: "",
  setNickname: (nickname) => set({ nickname }),
  setUser: (user) => set({ user }),
  cpAmount: {
    free: 0,
    locked: 0,
    total: 0,
  },
  metaAmount: {
    free: 0,
    locked: 0,
    total: 0,
  },
  addCp: (amount) =>
    set((state) => ({
      cpAmount: {
        ...state.cpAmount,
        free: state.cpAmount.free + amount,
        total: state.cpAmount.total + amount,
      },
    })),
  removeCp: (amount) =>
    set((state) => ({
      cpAmount: {
        ...state.cpAmount,
        free: Math.max(0, state.cpAmount.free - amount),
        total: Math.max(0, state.cpAmount.total - amount),
      },
    })),
  lockCp: (amount) =>
    set((state) => {
      const lockableAmount = Math.min(amount, state.cpAmount.free);
      return {
        cpAmount: {
          free: state.cpAmount.free - lockableAmount,
          locked: state.cpAmount.locked + lockableAmount,
          total: state.cpAmount.total,
        },
      };
    }),
  unlockCp: (amount) =>
    set((state) => {
      const unlockableAmount = Math.min(amount, state.cpAmount.locked);
      return {
        cpAmount: {
          free: state.cpAmount.free + unlockableAmount,
          locked: state.cpAmount.locked - unlockableAmount,
          total: state.cpAmount.total,
        },
      };
    }),
  addMeta: (amount) =>
    set((state) => ({
      metaAmount: {
        ...state.metaAmount,
        free: state.metaAmount.free + amount,
        total: state.metaAmount.total + amount,
      },
    })),
  removeMeta: (amount) =>
    set((state) => ({
      metaAmount: {
        ...state.metaAmount,
        free: Math.max(0, state.metaAmount.free - amount),
        total: Math.max(0, state.metaAmount.total - amount),
      },
    })),
  lockMeta: (amount) =>
    set((state) => {
      const lockableAmount = Math.min(amount, state.metaAmount.free);
      return {
        metaAmount: {
          free: state.metaAmount.free - lockableAmount,
          locked: state.metaAmount.locked + lockableAmount,
          total: state.metaAmount.total,
        },
      };
    }),
  unlockMeta: (amount) =>
    set((state) => {
      const unlockableAmount = Math.min(amount, state.metaAmount.locked);
      return {
        metaAmount: {
          free: state.metaAmount.free + unlockableAmount,
          locked: state.metaAmount.locked - unlockableAmount,
          total: state.metaAmount.total,
        },
      };
    }),
  setCpExact: (amount: number) =>
    set((state) => ({
      cpAmount: {
        free: amount,
        locked: state.cpAmount.locked,
        total: amount + state.cpAmount.locked,
      },
    })),
  setMetaExact: (amount: number) =>
    set((state) => {
      console.log("Setting meta amount in store:", amount);
      return {
        metaAmount: {
          free: amount,
          locked: state.metaAmount.locked,
          total: amount + state.metaAmount.locked,
        },
      };
    }),
  fetchUserBalance: async () => {
    try {
      const userData: any = await fetchUser();
      console.log(userData);
      set((state) => ({
        cpAmount: {
          free: userData.user.cp_amount_free,
          locked: userData.user.cp_amount_locked,
          total: userData.user.cp_amount_free + userData.user.cp_amount_locked,
        },
        metaAmount: {
          free: userData.user.meta_amount_free,
          locked: userData.user.meta_amount_locked,
          total: userData.user.meta_amount_free + userData.user.meta_amount_locked,
        },
      }));
    } catch (error) {
      console.error("Failed to fetch user balance:", error);
    }
  },
}));
// listener global bara offer bezar taghir krd user balance upshe