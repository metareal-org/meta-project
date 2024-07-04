import useMissionStore from "@/store/useMissionStore";
import { MissionId } from "../mission-config";
import { useEffect, useState } from "react";
import useDrawerStore from "@/store/gui-store/useDrawerStore";
import useJoyrideStore from "@/store/gui-store/useJoyrideStore";

export default function MissionOpenGiftbox() {
  const { selectedMission } = useMissionStore();
  const { addStep } = useJoyrideStore();
  const { setDrawerState } = useDrawerStore();
  const [giftJoyPlayed, setGiftJoyPlayed] = useState(false);
  useEffect(() => {
    if (selectedMission.id !== MissionId.OpenGiftBox) return;
    setDrawerState("inventoryDrawer", true);
    if (!giftJoyPlayed) {
      addStep({
        target: ".inventory-gift-target",
        content: "Click on giftbox to open it",
        disableBeacon: true,
        styles: {
          options: {
            zIndex: 10000,
          },
        },
      });
      setGiftJoyPlayed(true);
    }
  }, [selectedMission]);
}
