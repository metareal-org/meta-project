import { create } from "zustand";
export interface UserState {
  user: object | null;
  nickname: string;
  setNickname: (nickname: string) => void;
  setUser: (user: any) => void;
  cpAmount: number;
  setCpAmount: (cp: number) => void;
  metaAmount: number;
  setMetaAmount: (meta: number) => void;
}
export const useUserStore = create<UserState>((set) => ({
  user: null,
  nickname: "",
  setNickname: (nickname) => set({ nickname }),
  setUser: (user) => set({ user }),
  cpAmount: 0,
  setCpAmount: (cp) => set({ cpAmount: cp }),
  metaAmount: 0,
  setMetaAmount: (meta) => set({ metaAmount: meta }),
}));
