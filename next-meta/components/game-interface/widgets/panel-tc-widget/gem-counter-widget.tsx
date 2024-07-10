import React from "react";
import useGemStore from "@/store/objects-store/useGemsStore";
import { GemCoords } from "@/core/loaders/models-load/gems-coord";
import useMissionStore from "@/store/useMissionStore";
import { MissionId } from "@/core/missions/mission-config";

const GemCounterWidget = () => {
  const { gemPoints } = useGemStore();
  const totalGems = GemCoords.length;
  const progress = (gemPoints / totalGems) * 100;
  const { selectedMission } = useMissionStore();
  if (selectedMission?.id !== MissionId.CollectGems) return null;
  return (
    <div className="fixed z-10 bottom-8 right-0 left-0 mx-auto border-teal border rounded-full  w-[250px] items-center space-x-2 bg-teal-fg bg-opacity-70 p-2  shadow-md">
      <div className="flex items-center w-full gap-2">
        <div className="rounded-full bg-teal/30 p-1 border-teal border">
          <img src="/assets/images/tokens/greengem.webp" className="w-20" />
        </div>
        <div className="h-4 bg-lime-fg border w-full  border-white/10  rounded-full">
          <div className="h-full bg-lime rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="text-sm h-[18px] pr-2">
          {gemPoints}/{totalGems}
        </div>
      </div>
    </div>
  );
};

export default GemCounterWidget;
