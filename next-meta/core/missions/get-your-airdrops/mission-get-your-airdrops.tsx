import useMissionStore from "@/store/useMissionStore";
import { MissionId } from "../mission-config";
import { useEffect } from "react";
import useSpinwheelStore from "@/store/minigame-store/useSpinwheelStore";
import useAlertStore, { AlertConfig } from "@/store/gui-store/useAlertStore";
import { ArrowBigRight } from "lucide-react";
import { Grid } from "@/components/ui/tags";
import axiosInstance from "@/lib/axios-instance";
import useMapStore from "@/store/engine-store/useMapStore";
import { CHESTMAN_LOCATION } from "@/core/constants";

export default function MissionGetYourAirdrops() {
  const { selectedMission } = useMissionStore();
  const { setShowSpinModal } = useSpinwheelStore();
  const { openAlert } = useAlertStore();
  const { mapbox, setIsFlying } = useMapStore();
  useEffect(() => {
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
    });
    mapbox.once("moveend", () => {
      setIsFlying(false);
      openAlert({
        title: "It's time to trade",
        picture: "/assets/images/minigames/spinwheel/trademodal.jpg",
        description: (
          <>
            <div className="grid gap-2">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse, asperiores! Fugiat pariatur quas ea assumenda possimus saepe voluptatibus
              quibusdam ullam quidem alias dolorem
            </div>
            <div className="bg-black-1000/20 mt-4 rounded-xl w-full p-4 flex  items-center justify-center">
              <Grid className="place-items-center">
                <img className="!w-20 bg-black-1000/20 p-2 border rounded block" src="/assets/images/tokens/meta.png" />
                <div className="text-xs mt-2">53 Gems</div>
              </Grid>
              <ArrowBigRight fill="white" strokeWidth={0} size={40} />
              <Grid className="place-items-center">
                <img className="!w-20 bg-black-1000/20 p-2 border rounded block" src="/assets/images/minigames/spinwheel/ticket_icon.webp" />
                <div className="text-xs mt-2">1 Spinwheel Ticket</div>
              </Grid>
            </div>
          </>
        ),
        buttons: [
          {
            label: "Trade",
            onClick: () => {
              setShowSpinModal(true);
            },
          },
        ],
      });
    });
  }, [selectedMission]);
}
