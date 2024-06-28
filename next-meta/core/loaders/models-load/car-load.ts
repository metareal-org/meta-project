import useMapStore from "@/store/engine-store/useMapStore";
import useThreeboxStore, { ThreeboxStore } from "@/store/engine-store/useThreeboxStore";
import { CAR_INITIAL_COORDINATE } from "@/core/constants";
import useCarStore from "@/store/objects-store/useCarStore";
import * as THREE from "three";

export default function loadCar() {
  const { mapbox } = useMapStore.getState();
  const { threebox } = useThreeboxStore.getState() as ThreeboxStore;
  const { isCarLoaded, setIsCarLoaded } = useCarStore.getState();

  if (mapbox && threebox && !isCarLoaded) {
    const options = {
      type: "gltf",
      obj: "assets/models/car/scene.gltf",
      units: "meters",
      scale: 1,
      rotation: { x: 90, y: 0, z: 0 },
      anchor: "center",
    };

    threebox.loadObj(options, (model: any) => {
      model.setCoords(CAR_INITIAL_COORDINATE);
      threebox.add(model);
      model.castShadow = true;

      // Ensure the car material reacts to light
      model.traverse((child: any) => {
        if (child.isMesh) {
          child.material.metalness = 0.4;
          child.material.roughness = 0.6;
        }
      });

      // Increase car light intensities
      const frontLight1 = new THREE.PointLight(0xffffff, 0.8, 7); // Increased from 0.5 to 0.8
      frontLight1.position.set(1, 0.5, 2);
      model.add(frontLight1);

      const frontLight2 = new THREE.PointLight(0xffffff, 0.8, 7); // Increased from 0.5 to 0.8
      frontLight2.position.set(-1, 0.5, 2);
      model.add(frontLight2);

      const rearLight1 = new THREE.PointLight(0xff0000, 0.5, 5); // Increased from 0.3 to 0.5
      rearLight1.position.set(0.5, 0.5, -2);
      model.add(rearLight1);

      const rearLight2 = new THREE.PointLight(0xff0000, 0.5, 5); // Increased from 0.3 to 0.5
      rearLight2.position.set(-0.5, 0.5, -2);
      model.add(rearLight2);

      useCarStore.getState().setModel(model);
      setIsCarLoaded(true);
    });
  }
}
