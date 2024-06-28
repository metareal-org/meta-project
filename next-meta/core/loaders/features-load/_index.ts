import { loadBuildings } from "@/core/loaders/features-load/buildings-load";
import { loadMines } from "@/core/loaders/features-load/mines-load";

export function loadFeatures() {
  loadBuildings();
  loadMines();
}
