import useMissionStore from "@/store/useMissionStore";
import { MissionId } from "@/core/missions/mission-config";
import useAvatarStore, { DEFAULT_AVATAR } from "@/store/objects-store/useAvatarStore";
import { useEffect } from "react";
import axiosInstance from "@/lib/axios-instance";

const DEBUG = true;
export default function MissionCreateAvatar() {
  const { selectedMission, setSelectedMission } = useMissionStore();
  const { avatarUrl } = useAvatarStore();
  useEffect(() => {
    if (selectedMission.id !== MissionId.CreateAvatar) return;

    axiosInstance
      .post("user/update", {
        current_mission: MissionId.CreateAvatar,
      })
      .then((response) => {
        DEBUG && console.log(response);
      });

    if (avatarUrl !== "" && avatarUrl !== null && avatarUrl !== DEFAULT_AVATAR) {
      axiosInstance
        .post("user/update", {
          avatar_url: avatarUrl,
        })
        .then((response) => {
          DEBUG && console.log(response);
        });
      setSelectedMission(MissionId.CollectGems);
    }
  }, [avatarUrl, selectedMission.id]);
}
