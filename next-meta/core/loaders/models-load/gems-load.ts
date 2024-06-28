import useMapStore from "@/store/engine-store/useMapStore";
import useThreeboxStore, { ThreeboxStore } from "@/store/engine-store/useThreeboxStore";
import useGemStore from "@/store/objects-store/useGemsStore"; // Assuming you have a gem store
import { GemCoords } from "./gems-coord"; // Import your gem coordinates

export default function loadGems() {
  const { mapbox } = useMapStore.getState();
  const { threebox } = useThreeboxStore.getState() as ThreeboxStore;
  const { setAreGemsLoaded, areGemsLoaded } = useGemStore.getState();
  if (mapbox && threebox && !areGemsLoaded) {
    const models = GemCoords.map((coord) => ({
      type: "gltf",
      obj: "/assets/models/gem/scene.gltf",
      units: "meters",
      scale: 0.5,
      rotation: { x: 90, y: 0, z: 0 },
      anchor: "center",
      origin: coord,
    }));
    Promise.all(
      models.map((modelOptions) => {
        return new Promise((resolve) => {
          threebox.loadObj(modelOptions, (model: any) => {
            model.setCoords(modelOptions.origin);
            model.addTooltip("A gem model", true);
            threebox.add(model);
            model.castShadow = true;
            useGemStore.getState().addModel(model);
            resolve(model);
          });
        });
      })
    )
      .then(() => {
        setAreGemsLoaded(true);
      })
      .catch((error) => {
        console.error("Error loading models:", error);
      });
  }
}
