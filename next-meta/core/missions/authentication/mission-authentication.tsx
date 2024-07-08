import { MissionId } from "@/core/missions/mission-config";
import useMissionStore from "@/store/useMissionStore";

export default function MissionAuthentication() {
  if (useMissionStore().selectedMission.id !== MissionId.Authentication) return;
  console.log("skiping authentication mission");
  useMissionStore().setSelectedMission(MissionId.SetNickname);

  return null;
}
