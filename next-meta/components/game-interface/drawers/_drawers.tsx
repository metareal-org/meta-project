import BuildingDrawer from "@/components/game-interface/drawers/building-drawer/_building-drawer";
import MineDrawer from "@/components/game-interface/drawers/mine-drawer";
import InventoryDrawer from "./inventory-drawer/_inventory-drawer";
import MylandsDrawer from "./mylands-drawer/_mylands-drawer";

export default function Drawers() {
  return (
    <>
      <BuildingDrawer />
      <MineDrawer />
      <InventoryDrawer />
      <MylandsDrawer />
    </>
  );
}
