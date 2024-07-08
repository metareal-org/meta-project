import { loadLands } from "@/core/loaders/features-load/lands-load";
import { loadMines } from "@/core/loaders/features-load/mines-load";

export function loadFeatures() {
  loadLands();
  // loadMines();
}
