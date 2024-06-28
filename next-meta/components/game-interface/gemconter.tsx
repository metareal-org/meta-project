import React from "react";
import useGemStore from "@/store/objects-store/useGemsStore";
import { GemCoords } from "@/core/loaders/models-load/gems-coord";
import useMissionStore from "@/store/useMissionStore";
import { MissionId } from "@/core/missions/mission-config";

const GemProgressBar = () => {
  const { gemPoints } = useGemStore();
  const totalGems = GemCoords.length;
  const progress = (gemPoints / totalGems) * 100;
  const { selectedMission } = useMissionStore();
  if (selectedMission?.id !== MissionId.CollectGems) return null;
  return (
    <div className="fixed top-24 right-4 flex w-[200px] items-center space-x-2 bg-blue bg-opacity-70 p-4 rounded-lg shadow-md">
      <div className="flex-1">
        <div className="h-4 bg-green-fg rounded-full">
          <div className="h-full bg-green rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <div className="text-sm font-semibold">
        {gemPoints}/{totalGems} Gems
      </div>
    </div>
  );
};

export default GemProgressBar;
