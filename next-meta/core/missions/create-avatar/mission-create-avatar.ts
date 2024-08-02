import useMissionStore from "@/store/useMissionStore";
import { MissionId } from "@/core/missions/mission-config";
import useAvatarStore, { DEFAULT_AVATAR } from "@/store/objects-store/useAvatarStore";
import { useEffect } from "react";
import { useUserStore } from "@/store/player-store/useUserStore";
const DEBUG = true;
export default function MissionCreateAvatar() {
  const { updateUserMission, updateUserAvatar } = useUserStore.getState();
  const { selectedMission, setSelectedMission } = useMissionStore.getState();
  const { avatarUrl } = useAvatarStore();

  useEffect(() => {
    if (selectedMission.id !== MissionId.CreateAvatar) return;

    updateUserMission(MissionId.CreateAvatar).then((response) => {
      DEBUG && console.log(response);
    });

    if (avatarUrl !== "" && avatarUrl !== null && avatarUrl !== DEFAULT_AVATAR) {
      updateUserAvatar(avatarUrl).then((response) => {
        DEBUG && console.log(response);
      });
      setSelectedMission(MissionId.CollectGems);
    }
  }, [avatarUrl, selectedMission.id]);
  return null;
}
