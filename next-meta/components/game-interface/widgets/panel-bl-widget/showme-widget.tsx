import { Button } from "@/components/ui/button";
import { MissionId } from "@/core/missions/mission-config";
import useMapStore from "@/store/engine-store/useMapStore";
import useUnitStore from "@/store/world-store/useUnitStore";
import { LocateFixed } from "lucide-react";
import useMissionStore from "@/store/useMissionStore";
export default function ShowMeWidget() {
  const { mapbox } = useMapStore();
  const { unitCoordinates } = useUnitStore();
  const { selectedMission } = useMissionStore();
  const handleClick = () => {
    if (mapbox) {
      mapbox.flyTo({
        center: unitCoordinates,
        zoom: 17,
        speed: 1,
        curve: 1,
      });
    }
  };
  if (selectedMission.id != MissionId.Advanture) return;
  return (
    <>
      <div className="fixed z-10 bottom-5 left-5">
        <Button onClick={handleClick} variant="theme" className="!size-12 text-xl !p-0">
          <LocateFixed size={20} />
        </Button>
      </div>
    </>
  );
}
