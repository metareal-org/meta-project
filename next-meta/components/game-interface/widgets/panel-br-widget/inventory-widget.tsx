// components/game-interface/widgets/panel-br-widget/inventory-widget.tsx
import { Button } from "@/components/ui/button";
import useDrawerStore from "@/store/gui-store/useDrawerStore";
import { BackpackIcon } from "lucide-react";
export default function InventoryWidget() {
  const { inventoryDrawer, setDrawerState } = useDrawerStore();

  const handleClick = () => {
    setDrawerState("inventoryDrawer", !inventoryDrawer);
  };

  return (
    <>
      <div className="fixed z-10 bottom-5 right-5">
        <Button onClick={handleClick} variant="theme" className="inventory !size-12 text-xl !p-0">
          <BackpackIcon size={20} />
        </Button>
      </div>
    </>
  );
}
