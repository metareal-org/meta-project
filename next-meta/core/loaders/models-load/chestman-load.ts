// core/loaders/models-load/chestman-load.ts

import useMapStore from "@/store/engine-store/useMapStore";
import useThreeboxStore, { ThreeboxStore } from "@/store/engine-store/useThreeboxStore";
import useChestmanStore from "@/store/objects-store/useChestmanStore";
import { CHESTMAN_LOCATION } from "@/core/constants";
import { AnimationMixer, Clock } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function loadChestman() {
  const { mapbox } = useMapStore.getState();
  const { threebox } = useThreeboxStore.getState() as ThreeboxStore;
  const { chestmanModel, setModel } = useChestmanStore.getState();

  if (mapbox && threebox && !chestmanModel) {
    const options = {
      type: "gltf",
      obj: "./assets/models/chestman/chestman.glb",
      units: "meters",
      scale: 1.5,
      rotation: { x: 90, y: 0, z: 0 },
      anchor: "center",
    };

    threebox.loadObj(options, (model: any) => {
      model.setCoords(CHESTMAN_LOCATION);
      model.addTooltip("A chestman model", true);
      threebox.add(model);
      model.castShadow = true;
      setModel(model);
      setupAnimation(model);
    });
  }
}

function setupAnimation(model: any) {
  const loader = new GLTFLoader();
  loader.load("./assets/animations/M_Standing_Idle_Variations_003.glb", (gltf) => {
    const animationClip = gltf.animations[0];
    const mixer = new AnimationMixer(model);
    const action = mixer.clipAction(animationClip);
    action.play();

    const clock = new Clock();
    function animate() {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      mixer.update(delta);
    }
    animate();
  });
}