import axiosInstance from "../axios-instance";

interface Quest {
  id: number;
  title: string;
  description: string | null;
  rewards: { type: string; amount: number }[];
}

export const apiFetchQuests = async (): Promise<Quest[]> => {
  const response = await axiosInstance.get("/quests");
  return response.data;
};

export const apiCreateQuest = async (questData: Omit<Quest, "id">): Promise<Quest> => {
  const response = await axiosInstance.post("/quests", questData);
  return response.data;
};

export const apiFetchQuestDetails = async (questId: number): Promise<Quest> => {
  const response = await axiosInstance.get(`/quests/${questId}`);
  return response.data;
};

export const apiUpdateQuest = async (questId: number, questData: Partial<Omit<Quest, "id">>): Promise<Quest> => {
  const response = await axiosInstance.put(`/quests/${questId}`, questData);
  return response.data;
};

export const apiDeleteQuest = async (questId: number): Promise<void> => {
  await axiosInstance.delete(`/quests/${questId}`);
};

export const apiCompleteQuest = async (quest_id: number): Promise<{ message: string }> => {
  const response = await axiosInstance.post(`/quests/complete`, {
    quest_id,
  });
  return response.data;
};
