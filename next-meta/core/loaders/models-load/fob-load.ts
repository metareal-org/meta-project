import useMapStore from "@/store/engine-store/useMapStore";
import useThreeboxStore, { ThreeboxStore } from "@/store/engine-store/useThreeboxStore";
import useFobStore from "@/store/objects-store/useFobStore";
import { KEY_COORDINATE } from "@/core/constants";
import { gsap } from "gsap";

export default function loadFob() {
  const { mapbox } = useMapStore.getState();
  const { threebox } = useThreeboxStore.getState() as ThreeboxStore;

  if (mapbox && threebox) {
    const options = {
      type: "gltf",
      obj: "./assets/models/fob/fob.glb",
      units: "meters",
      scale: 20,
      rotation: { x: 180, y: 0, z: 0 },
      anchor: "center",
    };

    threebox.loadObj(options, (model: any) => {
      model.setCoords(KEY_COORDINATE);
      model.addTooltip("A fob model", true);
      threebox.add(model);
      model.castShadow = true;
      gsap.to(model.rotation, {
        z: "+=180",
        duration: 100,
        repeat: -1,
        ease: "none",
      });

      useFobStore.getState().setModel(model);
    });
  }
}
