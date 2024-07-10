import BuildingDrawer from "@/components/game-interface/drawers/building-drawer/_building-drawer";
import MineDrawer from "@/components/game-interface/drawers/mine-drawer/_mine-drawer";
import InventoryDrawer from "./inventory-drawer/_inventory-drawer";
import MylandsDrawer from "./mylands-drawer/_mylands-drawer";
import MyOffersDrawer from "./my-offers-drawer/_my-offers-drawer";

export default function Drawers() {
  return (
    <>
      <MyOffersDrawer />
      <BuildingDrawer />
      <MineDrawer />
      <InventoryDrawer />
      <MylandsDrawer />
    </>
  );
}
