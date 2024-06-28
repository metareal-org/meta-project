import { useEffect } from "react";
import useAvatarStore from "@/store/objects-store/useAvatarStore";
import useFobStore from "@/store/objects-store/useFobStore";
import useThreeboxStore, { ThreeboxStore } from "@/store/engine-store/useThreeboxStore";

const useAvatarFobLogic = () => {
  const { avatarModel } = useAvatarStore.getState();
  const { isFobPickedUp, checkNearbyFob } = useFobStore.getState();
  const { threebox } = useThreeboxStore.getState() as ThreeboxStore;
  useEffect(() => {
    if (!avatarModel || !threebox || isFobPickedUp) return;
    const handleObjectChanged = () => {
      checkNearbyFob(avatarModel.coordinates);
    };
    avatarModel.addEventListener("ObjectChanged", handleObjectChanged);
    return () => {
      avatarModel.removeEventListener("ObjectChanged", handleObjectChanged);
    };
  }, [avatarModel, threebox, isFobPickedUp, checkNearbyFob]);

  return null;
};

export default useAvatarFobLogic;
