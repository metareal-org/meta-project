// components/game-interface/drawers/inventory-drawer/index.tsx
import React from "react";
import { Card, Title } from "@/components/ui/tags";
import useDrawerStore from "@/store/gui-store/useDrawerStore";
import { XCircle } from "lucide-react";
import useSpinwheelStore from "@/store/minigame-store/useSpinwheelStore";
import useAlertStore from "@/store/gui-store/useAlertStore";

export default function InventoryDrawer() {
  const { inventoryDrawer, setDrawerState } = useDrawerStore();
  const { setShowSpinModal } = useSpinwheelStore();
  const { openAlert } = useAlertStore();
  if (!inventoryDrawer) return null;

  const handleClose = () => {
    setDrawerState("inventoryDrawer", false);
  };
  const showReadyToPlayAlert = () => {
    console.log("Showing ready to play alert");
    openAlert({
      title: "Are you ready to play the game?",
      picture: "/assets/images/missions/get-your-airdrops/read-to-spin.jfif",
      description: "Get ready for an exciting spin!",
      buttons: [
        {
          label: "Let's go!",
          onClick: () => {
            console.log("Let's go clicked, showing spin modal");
            setShowSpinModal(true);
          },
        },
      ],
    });
  };

  const handleTicketClick = () => {
    setDrawerState("inventoryDrawer", false);
    showReadyToPlayAlert();
  };

  return (
    <div className="fixed bottom-5 z-10 bg-black min-h-[200px] right-20 my-auto w-full max-w-sm shadow-lg rounded-lg p-4">
      <header className="flex pb-2 justify-between items-center">
        <Title className="text-teal font-semibold">Inventory</Title>
        <XCircle size={18} className="cursor-pointer" onClick={handleClose} />
      </header>
      <div className="bg-black-1000/30 rounded-lg p-4 grid grid-cols-3 gap-4">
        <Card
          className="tutorial-target rounded-lg relative flex items-center justify-center p-4 border border-white/20 bg-teal-fg/20 hover:bg-teal-fg/90 cursor-pointer aspect-square w-full"
          onClick={handleTicketClick}
        >
          <img src="/assets/images/inventory/ticket_icon.webp" alt="Ticket" />
          <div className="w-[28px] h-[24px] bg-teal-fg/90 rounded-[5px] text-xs flex items-center justify-center border border-teal absolute -bottom-1.5 -right-1.5">
            1
          </div>
        </Card>
        <Card
          className="tutorial-target-2 rounded-lg relative flex items-center justify-center p-4 border border-white/20 bg-teal-fg/20 hover:bg-teal-fg/90 cursor-pointer aspect-square w-full"
          onClick={()=>{}}
        >
          <img src="/assets/images/inventory/gift_icon.webp" alt="Ticket" />
          <div className="w-[28px] h-[24px] bg-teal-fg/90 rounded-[5px] text-xs flex items-center justify-center border border-teal absolute -bottom-1.5 -right-1.5">
            1
          </div>
        </Card>
        {Array.from({ length: 11 }).map((_, index) => (
          <Card key={index} className="rounded-lg relative bg-black/10 flex items-center justify-center p-4 border border-white/20 aspect-square w-full" />
        ))}
      </div>
    </div>
  );
}
