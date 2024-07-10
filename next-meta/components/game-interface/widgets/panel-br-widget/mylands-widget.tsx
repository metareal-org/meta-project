import { Button } from "@/components/ui/button";
import { MissionId } from "@/core/missions/mission-config";
import useDrawerStore from "@/store/gui-store/useDrawerStore";
import useMissionStore from "@/store/useMissionStore";
import {  HomeIcon } from "lucide-react";

export default function MylandsWidget() {
    const { mylandsDrawer, setDrawerState } = useDrawerStore();
    const { selectedMission } = useMissionStore();
    const handleClick = () => {
      setDrawerState("mylandsDrawer", !mylandsDrawer);
    };
    if (selectedMission.id < MissionId.GetYourAirdrops) return null;
  return (
    <>
      <div className="fixed z-10 bottom-20 right-5">
        <Button variant="theme" onClick={handleClick} className="!size-12 text-xl !p-0">
          <HomeIcon size={20} />
        </Button>
      </div>
    </>
  );
}
