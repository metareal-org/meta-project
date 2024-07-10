import InventoryWidget from "./inventory-widget";
import MyOffersWidget from "./my-offers-widger";
import MylandsWidget from "./mylands-widget";

export default function PanelBrWidget() {
  return (
    <>
      <MyOffersWidget />
      <MylandsWidget />
      <InventoryWidget />
    </>
  );
}
