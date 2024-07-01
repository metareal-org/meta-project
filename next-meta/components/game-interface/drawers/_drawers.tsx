import BuildingDrawer from "@/components/game-interface/drawers/building-drawer";
import MineDrawer from "@/components/game-interface/drawers/mine-drawer";
import InventoryDrawer from "./inventory-drawer";

export default function Drawers() {
  return (
    <>
      <BuildingDrawer />
      <MineDrawer />
      <InventoryDrawer />
    </>
  );
}
