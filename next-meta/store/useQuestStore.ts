import { create } from "zustand";
import axiosInstance from "@/lib/axios-instance";
import { useUserStore } from "./player-store/useUserStore";

interface QuestStore {
  compeleteQuest: (quest_id: number) => Promise<any>;
}

export const useQuestStore = create<QuestStore>(() => ({
  compeleteQuest: async (quest_id: number) => {
    try {
      const response = await axiosInstance.post(`/quests/complete`, {
        quest_id,
      });
      const { fetchUser } = useUserStore.getState();
      fetchUser();
      return response.data;
    } catch (error) {
      console.log("Failed to complete quest:", error);
    }
  },
}));
