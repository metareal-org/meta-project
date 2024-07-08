// core/missions/advanture/mission-advanture.ts

import useMapStore from "@/store/engine-store/useMapStore";
import useMissionStore from "@/store/useMissionStore";
import { useEffect } from "react";
import { MissionId } from "../mission-config";
import loadUnit from "@/core/loaders/markers-load/unit-load";
import axiosInstance from "@/lib/axios-instance";
import useUnitStore from "@/store/world-store/useUnitStore";

export default function MissionAdvanture() {
  const { mapbox } = useMapStore();
  const { selectedMission } = useMissionStore();

  useEffect(() => {
    if (selectedMission?.id !== MissionId.Advanture || !mapbox) return;

    axiosInstance.post("user/update/", {
      current_mission: MissionId.Advanture,
    });

    loadUnit();
    // mapbox.flyTo({
    //   center: useUnitStore.getState().unitCoordinates,
    //   zoom: 18,
    //   pitch: 0,
    //   bearing: 0,
    // });
    mapbox.jumpTo({
      center: useUnitStore.getState().unitCoordinates,
      zoom: 18,
      pitch: 0,
      bearing: 0,
    });
  }, [selectedMission, mapbox]);

}
