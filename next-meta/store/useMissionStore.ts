import { create, StoreApi } from "zustand";
import { MissionConfig, missionConfigs, MissionId } from "@/core/missions/mission-config";
import zukeeper from "zukeeper";

type MissionState = {
  missions: MissionConfig[];
  selectedMission: MissionConfig;
  setSelectedMission: (missionId: number) => void;
};

const getMissionById = (missionId: number): MissionConfig => {
  return missionConfigs.find((mission) => mission.id === missionId) || missionConfigs[0];
};

export const useMissionStore = create<MissionState>(
  zukeeper((set: StoreApi<MissionState>["setState"]) => ({
    missions: missionConfigs,
    selectedMission: getMissionById(MissionId.Initialize),
    setSelectedMission: (missionId: number) => {
      const mission = getMissionById(missionId);
      set({ selectedMission: mission });
    },
  }))
);
export default useMissionStore;