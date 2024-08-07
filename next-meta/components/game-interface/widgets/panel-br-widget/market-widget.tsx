import { Button } from "@/components/ui/button";
import { MissionId } from "@/core/missions/mission-config";
import useMissionStore from "@/store/useMissionStore";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MarketWidget() {
  const { selectedMission } = useMissionStore();
  const router = useRouter();

  const handleClick = () => {
    router.push("/market");
  };

  if (selectedMission.id < MissionId.GetYourAirdrops) return null;

  return (
    <>
      <div>
        <Button onClick={handleClick} variant="theme" className=" !size-12 text-xl !p-0">
          <ShoppingCart size={20} />
        </Button>
      </div>
    </>
  );
}
