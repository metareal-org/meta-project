import useMapStore from "@/store/engine-store/useMapStore";
import useThreeboxStore, { ThreeboxStore } from "@/store/engine-store/useThreeboxStore";
import useAvatarStore from "@/store/objects-store/useAvatarStore";
import useLoadingStore from "@/store/gui-store/useLoadingStore";
import { AZADI_TOWER_COORDINATES } from "@/core/constants";

export default function loadAvatar() {
  const { mapbox } = useMapStore.getState();
  const { threebox } = useThreeboxStore.getState() as ThreeboxStore;
  const { avatarUrl, isAvatarLoaded, setIsAvatarLoaded } = useAvatarStore.getState();
  if (mapbox && threebox && avatarUrl && !isAvatarLoaded) {
    useLoadingStore.getState().openLoading();
    useLoadingStore.getState().setText({
      title: "Loading Avatar",
      description: "Please wait while the avatar is being loaded...",
    });

    const options = {
      type: "gltf",
      obj: avatarUrl,
      units: "meters",
      scale: 2,
      rotation: { x: 90, y: 0, z: 0 },
      anchor: "center",
    };
    threebox.loadObj(options, (model: any) => {
      model.setCoords(AZADI_TOWER_COORDINATES);
      model.addTooltip("A avatar model", true);
      threebox.add(model);
      model.castShadow = true;
      useAvatarStore.getState().setModel(model);
      useLoadingStore.getState().closeLoading();
      setIsAvatarLoaded(true);
    });
  }
}
