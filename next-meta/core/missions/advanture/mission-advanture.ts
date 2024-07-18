import useMapStore from "@/store/engine-store/useMapStore";
import useMissionStore from "@/store/useMissionStore";
import { cache, useEffect } from "react";
import { MissionId } from "../mission-config";
import loadUnit from "@/core/loaders/markers-load/unit-load";
import useUnitStore from "@/store/world-store/useUnitStore";
import { updateUserMission } from "@/lib/api/user";
import { usePlayerOffersStore } from "@/store/player-store/usePlayerOffersStore";
import { useUserStore } from "@/store/player-store/useUserStore";

export default function MissionAdvanture() {
  const { mapbox } = useMapStore();
  const { selectedMission } = useMissionStore();
  const { playerOffers } = usePlayerOffersStore();
  const { fetchUserData } = useUserStore();
  useEffect(() => {
    if (selectedMission?.id !== MissionId.Advanture || !mapbox) return;
    updateUserMission(MissionId.Advanture)
      .then(() => {
        loadUnit();
        mapbox.jumpTo({
          center: useUnitStore.getState().unitCoordinates,
          zoom: 18,
          pitch: 0,
          bearing: 0,
        });
      })
      .catch(console.error);
  }, [selectedMission, mapbox]);

  useEffect(() => {
    fetchUserData();
  }, [playerOffers]);

  return null;
}
