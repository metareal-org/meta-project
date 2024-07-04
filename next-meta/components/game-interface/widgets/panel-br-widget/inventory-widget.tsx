// components/game-interface/widgets/panel-br-widget/inventory-widget.tsx
import { Button } from "@/components/ui/button";
import { MissionId } from "@/core/missions/mission-config";
import useDrawerStore from "@/store/gui-store/useDrawerStore";
import useMissionStore from "@/store/useMissionStore";
import { BackpackIcon } from "lucide-react";
export default function InventoryWidget() {
  const { inventoryDrawer, setDrawerState } = useDrawerStore();
  const { selectedMission } = useMissionStore();
  const handleClick = () => {
    setDrawerState("inventoryDrawer", !inventoryDrawer);
  };
  if (selectedMission.id < MissionId.GetYourAirdrops) return null;
  return (
    <>
      <div className="fixed z-10 bottom-5 right-5">
        <Button onClick={handleClick} variant="theme" className="inventory !size-12 text-xl !p-0">
          <BackpackIcon size={20} />
        </Button>
      </div>
    </>
  );
}
