// components/game-interface/widgets/panel-br-widget/my-offers-widget.tsx

import { Button } from "@/components/ui/button";
import { MissionId } from "@/core/missions/mission-config";
import useDrawerStore from "@/store/gui-store/useDrawerStore";
import useMissionStore from "@/store/useMissionStore";
import { TagIcon } from "lucide-react";

export default function MyOffersWidget() {
  const { myOffersDrawer, setDrawerState } = useDrawerStore();
  const { selectedMission } = useMissionStore();

  const handleClick = () => {
    setDrawerState("myOffersDrawer", !myOffersDrawer);
  };

  if (selectedMission.id < MissionId.GetYourAirdrops) return null;

  return (
    <>
      <div>
        <Button variant="theme" onClick={handleClick} className="my-offers !size-12 text-xl !p-0">
          <TagIcon size={20} />
        </Button>
      </div>
    </>
  );
}