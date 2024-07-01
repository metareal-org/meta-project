// core/missions/get-your-airdrops/mission-get-your-airdrops.tsx
import React, { useEffect, useState } from "react";
import useMissionStore from "@/store/useMissionStore";
import { MissionId } from "../mission-config";
import useAlertStore from "@/store/gui-store/useAlertStore";
import { ArrowBigRight } from "lucide-react";
import axiosInstance from "@/lib/axios-instance";
import useMapStore from "@/store/engine-store/useMapStore";
import { CHESTMAN_LOCATION } from "@/core/constants";
import useDrawerStore from "@/store/gui-store/useDrawerStore";
import useJoyrideStore from "@/store/gui-store/useJoyrideStore";

export default function MissionGetYourAirdrops() {
  const { selectedMission } = useMissionStore();
  const { openAlert } = useAlertStore();
  const { mapbox, setIsFlying } = useMapStore();
  const { addStep } = useJoyrideStore();
  const { activeDrawer } = useDrawerStore();
  const [ticketJoyPlayed, setTicketJoyPlayed] = useState(false);
  useEffect(() => {
    console.log("MissionGetYourAirdrops rendered, selectedMission:", selectedMission);
    if (selectedMission?.id !== MissionId.GetYourAirdrops) return;
    axiosInstance.post("user/update", {
      current_mission: MissionId.GetYourAirdrops,
    });
    if (!mapbox) return;
    setIsFlying(true);
    mapbox.flyTo({
      center: CHESTMAN_LOCATION,
      zoom: 30,
      bearing: 50,
      pitch: 60,
      duration: 1,
    });
    mapbox.once("moveend", () => {
      setIsFlying(false);
      showTradeAlert();
    });
  }, [selectedMission, mapbox]);
  const showTradeAlert = () => {
    console.log("Showing trade alert");
    openAlert({
      title: "It's time to trade",
      picture: "/assets/images/missions/get-your-airdrops/gem-for-gift.jfif",
      description: (
        <>
          <div className="grid gap-2">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse, asperiores! Fugiat pariatur quas ea assumenda possimus saepe voluptatibus quibusdam
            ullam quidem alias dolorem
          </div>
          <div className="bg-black-1000/20 mt-4 rounded-xl w-full pt-4 flex  items-center justify-center">
            <div className="flex-col items-center h-32">
              <img className="!w-20 p-2 border rounded block" src="/assets/images/tokens/greengem.webp" />
              <div className="text-xs break-words text-center mt-2">53 Gems</div>
            </div>
            <ArrowBigRight className="mb-10" fill="white" strokeWidth={0} size={40} />
            <div className="flex-col items-center h-32">
              <img className="!w-20 p-2 border rounded block" src="/assets/images/inventory/ticket_icon.webp" />
              <div className="text-xs w-20 break-words text-center mt-2">1 Spinwheel Ticket</div>
            </div>
          </div>
        </>
      ),
      buttons: [
        {
          label: "Trade",
          onClick: () => {
            console.log("Trade button clicked");
            addStep({
              target: ".inventory",
              content: "Click on the Inventory button to open your inventory",
              disableBeacon: true,
            });
          },
        },
      ],
    });
  };
  useEffect(() => {
    if (activeDrawer === "inventoryDrawer" && !ticketJoyPlayed && selectedMission?.id === MissionId.GetYourAirdrops) {
      addStep({
        target: ".tutorial-target",
        content: "Click on the ticket to open the Spinwheel",
        disableBeacon: true,
        styles: {
          options: {
            zIndex: 10000,
          },
        },
      });
      setTicketJoyPlayed(true);
    }
  }, [activeDrawer]);
  return null;
}
