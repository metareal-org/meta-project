import { create } from "zustand";
export interface UserState {
  user: object | null;
  nickname: string;
  setNickname: (nickname: string) => void;
  setUser: (user: any) => void;
}
export const useUserStore = create<UserState>((set) => ({
  user: null,
  nickname: "",
  setNickname: (nickname) => set({ nickname }),
  setUser: (user) => set({ user }),
}));
