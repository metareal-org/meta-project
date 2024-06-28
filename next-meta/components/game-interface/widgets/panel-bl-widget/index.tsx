import { Button } from "@/components/ui/button";
import useMapStore from "@/store/engine-store/useMapStore";
import useUnitStore from "@/store/world-store/useUnitStore";
import { LocateFixed } from "lucide-react";
export default function PanelBlWidgect() {
  return (
    <>
      <div className="fixed z-10 bottom-5 left-5">
        <FlyToUnitLocationButton />
      </div>
    </>
  );
}
const FlyToUnitLocationButton = () => {
  const { mapbox } = useMapStore();
  const { unitCoordinates } = useUnitStore();
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
  return (
    <Button onClick={handleClick} variant="theme" className="size-12 p-0">
      <LocateFixed size={20} />
    </Button>
  );
};
