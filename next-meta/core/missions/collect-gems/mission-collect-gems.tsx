import useGemStore from "@/store/objects-store/useGemsStore";
import useMissionStore from "@/store/useMissionStore";
import useFobStore from "@/store/objects-store/useFobStore";
import { useEffect, useState } from "react";
import { MissionId } from "@/core/missions/mission-config";
import useAlertStore from "@/store/gui-store/useAlertStore";
import useAvatarStore from "@/store/objects-store/useAvatarStore";
import useThreeboxStore, { ThreeboxStore } from "@/store/engine-store/useThreeboxStore";
import loadAvatar from "@/core/loaders/models-load/avatar-load";
import loadFob from "@/core/loaders/models-load/fob-load";
import useAvatarLogic from "@/hooks/useAvatarLogics";
import loadGems from "@/core/loaders/models-load/gems-load";
import useAvatarGemsLogic from "@/hooks/useAvatarGemsLogics";
import useAvatarFobLogic from "@/hooks/useAvatarFobLogics";
import useMapStore from "@/store/engine-store/useMapStore";
import { AZADI_TOWER_COORDINATES } from "@/core/constants";
import axiosInstance from "@/lib/axios-instance";

export default function MissionCollectGems() {
  const { setSelectedMission, selectedMission } = useMissionStore();
  const { gemPoints } = useGemStore();
  const { mapbox, stopSpinGlobe } = useMapStore();
  const { fobModel, isFobNearby } = useFobStore();
  const { openAlert } = useAlertStore();
  const { isAvatarLoaded } = useAvatarStore();
  const { threebox } = useThreeboxStore() as ThreeboxStore;
  const isMissionCollecting = selectedMission?.id == MissionId.CollectGems;
  const GEM_COUNT = 3;
  useEffect(() => {
    if (!threebox) return;
    loadGems();
  }, [threebox]);

  useEffect(() => {
    if (isMissionCollecting && mapbox) {
      stopSpinGlobe();
      mapbox.flyTo({
        center: AZADI_TOWER_COORDINATES,
        zoom: 20,
        bearing: 50,
        pitch: 60,
      });
      loadAvatar();
      loadFob();
    }
  }, [selectedMission]);

  useEffect(() => {
    if (!isAvatarLoaded) return;
    axiosInstance.post("user/update", {
      current_mission: MissionId.CollectGems,
    });
    useAvatarGemsLogic();
    openAlert({
      title: "Welcome to Azadi 'Tower",
      picture: "/assets/images/missions/collect-gems/collect-gems-alert.jpg",
      description: (
        <div>
          Welcome to the world of Metareal. If you're ready to start playing, your first mission is to{" "}
          <span className="text-primary">Collect {GEM_COUNT} Gems</span> scattered around the area and then pick up the machine switch. If you complete the
          steps, you will be rewarded in return.
        </div>
      ),
      buttons: [{ label: "I'm ready" }],
    });
  }, [isAvatarLoaded]);

  useEffect(() => {
    if (isFobNearby && gemPoints >= GEM_COUNT) {
      openAlert({
        title: "Ready to drive?",
        description:
          "Great! At this stage, you need to get the car to its destination. To know where to go, you can look at the map at the bottom left of the screen.",
        picture: "/assets/images/missions/collect-gems/ready-to-drive.jpg",
        buttons: [
          {
            label: "Enter the car",
            onClick: () => {
              setSelectedMission(MissionId.DriveToChestman);
              fobModel.visible = false;
            },
          },
        ],
      });
    } else if (isFobNearby && gemPoints < GEM_COUNT) {
      openAlert({
        title: "Not yet!",
        description: "You need to collect 53 gems first",
        picture: "/assets/images/missions/collect-gems/warning.jpg",
        buttons: [{ label: "ok!" }],
      });
    }
  }, [isFobNearby]);

  useAvatarLogic();
  useAvatarFobLogic();

  return null;
}
