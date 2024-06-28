import { useEffect } from "react";
import { quadtree } from "d3-quadtree";
import useAvatarStore from "@/store/objects-store/useAvatarStore";
import useGemStore from "@/store/objects-store/useGemsStore";
import useThreeboxStore, { ThreeboxStore } from "@/store/engine-store/useThreeboxStore";

const DISTANCE_THRESHOLD = 0.00002;

const useAvatarGemsLogic = () => {
  const { avatarModel, isAvatarLoaded } = useAvatarStore.getState();
  const { gemModels, setGemVisibility, increaseGemPoints } = useGemStore.getState();
  const { threebox } = useThreeboxStore.getState() as ThreeboxStore;

  if (!isAvatarLoaded || !threebox) return;

  
  const qt = quadtree()
    .x((d: any) => d.coordinates[0])
    .y((d: any) => d.coordinates[1])
    .addAll(gemModels as any);
  const handleObjectChanged = () => {
    const nearbyGem = qt.find(avatarModel.coordinates[0], avatarModel.coordinates[1], DISTANCE_THRESHOLD) as any;
    if (nearbyGem && nearbyGem.visible) {
      nearbyGem.visible = false;
      setGemVisibility(nearbyGem, false);
      increaseGemPoints();
    }
  };
  avatarModel.addEventListener("ObjectChanged", handleObjectChanged);
  return () => {
    avatarModel.removeEventListener("ObjectChanged", handleObjectChanged);
  };
};

export default useAvatarGemsLogic;
