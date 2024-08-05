import InventoryWidget from "./inventory-widget";
import MarketWidget from "./market-widget";
import MyOffersWidget from "./my-offers-widget";
import MylandsWidget from "./mylands-widget";

export default function PanelBrWidget() {
  return (
    <div className="flex flex-col z-10 gap-2 fixed bottom-5 right-5">
      <MarketWidget />
      <MyOffersWidget />
      <MylandsWidget />
      <InventoryWidget />
    </div>
  );
}
