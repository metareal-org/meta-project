import { UNIT_COORDINATES } from "@/core/constants";
import useMapStore from "@/store/engine-store/useMapStore";
import useAlertStore, { AlertConfig } from "@/store/gui-store/useAlertStore";
import useSpinwheelStore from "@/store/minigame-store/useSpinwheelStore";
import useMissionStore from "@/store/useMissionStore";
import { useEffect } from "react";
import { MissionId } from "../mission-config";
import useUnitStore from "@/store/world-store/useUnitStore";
import loadUnit from "@/core/loaders/markers-load/unit-load";
import axiosInstance from "@/lib/axios-instance";
export default function MissionAdvanture() {
  const { openAlert } = useAlertStore();
  const { setShowSpinModal } = useSpinwheelStore();
  const { mapbox } = useMapStore();
  const { selectedMission } = useMissionStore();
  useEffect(() => {
    if (selectedMission?.id !== MissionId.Advanture || !mapbox) return;
    axiosInstance.post("user/update", {
      current_mission: MissionId.Advanture,
    });
    loadUnit();
    openAlert({
      title: "You won a gift box!",
      description: " You won a gift box are you ready to open it?",
      picture: "/assets/images/minigames/spinwheel/giftbox.jpg",
      buttons: [
        {
          label: "Open it",
          onClick() {
            setShowSpinModal(false);
            openAlert({
              title: "You opened the gift box!",
              description: " You opened the gift box!",
              picture: "/assets/images/minigames/spinwheel/openedbox.jpg",
              buttons: [
                {
                  label: "Thanx!",
                  onClick: () => {
                    mapbox?.flyTo({
                      center: UNIT_COORDINATES,
                      zoom: 18,
                      pitch: 0,
                      bearing: 0,
                    });
                  },
                },
              ],
            } as AlertConfig);
          },
        },
      ],
    } as AlertConfig);
  }, [selectedMission]);
}
