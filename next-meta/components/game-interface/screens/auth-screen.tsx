import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { MissionId } from "@/core/missions/mission-config";
import useMapStore from "@/store/engine-store/useMapStore";
import useMissionStore from "@/store/useMissionStore";

export default function AuthScreen() {
  const { selectedMission } = useMissionStore();
  const { isFlying } = useMapStore();
  const [isClient, setIsClient] = useState(false);
  const { address } = useAccount();
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (selectedMission?.id !== MissionId.Initialize) return null;
  return isClient ? (
    <>
      <div className={`fixed z-10 pointer-events-none w-dvw h-dvh`}>
        <div className="w-full h-full flex items-end pb-40 justify-center">
          <div className="pointer-events-auto">
            <w3m-button />
          </div>
        </div>
      </div>
    </>
  ) : null;
}
