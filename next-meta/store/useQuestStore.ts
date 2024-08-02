import { apiCompleteQuest } from "@/lib/api/quests";
import { create } from "zustand";
import { useUserStore } from "./player-store/useUserStore";
export const useQuestStore = create(() => ({
  compeleteQuest: async (quest_id: number) => {
    try {
      const response = await apiCompleteQuest(quest_id);
      const { fetchUser } = useUserStore.getState();
      fetchUser();
      return response;
    } catch (error) {
      console.error("Failed to complete quest:", error);
    }
  },
}));
