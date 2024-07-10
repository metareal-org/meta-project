import React, { cache } from "react";
import { Card, Title } from "@/components/ui/tags";
import useDrawerStore from "@/store/gui-store/useDrawerStore";
import { XCircle } from "lucide-react";
import useSpinwheelStore from "@/store/minigame-store/useSpinwheelStore";
import useAlertStore from "@/store/gui-store/useAlertStore";
import { useInventoryStore } from "@/store/player-store/useInventoryStore";
import { useUserStore } from "@/store/player-store/useUserStore";
import { MissionId } from "@/core/missions/mission-config";
import useMissionStore from "@/store/useMissionStore";
import { updateCpAmount, updateMetaAmount } from "@/lib/api/user";

export default function InventoryDrawer() {
  const { inventoryDrawer, setDrawerState } = useDrawerStore();
  const { setShowSpinModal } = useSpinwheelStore();
  const { openAlert } = useAlertStore();
  const { items } = useInventoryStore();
  const { setCpExact, setMetaExact } = useUserStore();
  const { setSelectedMission } = useMissionStore();
  const { updateItemCount } = useInventoryStore();
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
  const handleItemClick = async (name: string, count: number) => {
    if (count === 0) return;
    if (name === "Ticket") {
      setDrawerState("inventoryDrawer", false);
      showReadyToPlayAlert();
    }
    if (name === "Gift") {
      try {
        await updateCpAmount("add", 5000);
        await updateMetaAmount("add", 1000000);
      } catch {
      } finally {
        setCpExact(5000);
        setMetaExact(1000000);
        openAlert({
          title: "Gift opened",
          picture: "/assets/images/inventory/openedbox.jpg",
          description: (
            <>
              <div className="grid gap-2">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse, asperiores! Fugiat pariatur quas ea assumenda possimus saepe voluptatibus
                quibusdam ullam quidem alias dolorem
              </div>
              <div className="bg-black-1000/20 mt-4 rounded-xl w-full pt-4 flex  items-center justify-center">
                <div className="flex-col items-center h-32">
                  <img className="!w-20 p-2 border rounded block" src="/assets/images/tokens/cp.webp" />
                  <div className="text-xs break-words text-center mt-2">5000 CP</div>
                </div>
              </div>
            </>
          ),
          buttons: [
            {
              label: "Close",
              onClick: () => {
                updateItemCount("Gift", 0);
                setSelectedMission(MissionId.Advanture);
                setDrawerState("inventoryDrawer", false);
              },
            },
          ],
        });
      }
    }
  };
  return (
    <div className="fixed bottom-5 z-10 bg-black min-h-[200px] right-20 my-auto w-full max-w-sm shadow-lg rounded-lg p-4">
      <header className="flex pb-2 justify-between items-center">
        <Title className="text-teal font-semibold">Inventory</Title>
        <XCircle size={18} className="cursor-pointer" onClick={handleClose} />
      </header>
      <div className="bg-black-1000/30 rounded-lg p-4 grid grid-cols-3 gap-4">
        {items.map((item, index) => (
          <Card
            key={index}
            className={`${item.className || ""} rounded-lg relative flex items-center justify-center p-4 border border-white/20 
              ${item.count > 0 ? "bg-teal-fg/20 hover:bg-teal-fg/90 cursor-pointer" : "bg-gray-500/20 cursor-not-allowed"}
              aspect-square w-full`}
            onClick={() => handleItemClick(item.name, item.count)}
          >
            <img src={item.imgSrc} alt={item.name} className={item.count === 0 ? "grayscale" : ""} />
            <div className="w-[28px] h-[24px] bg-teal-fg/90 rounded-[5px] text-xs flex items-center justify-center border border-teal absolute -bottom-1.5 -right-1.5">
              {item.count}
            </div>
          </Card>
        ))}
        {Array.from({ length: Math.max(0, 12 - items.length) }).map((_, index) => (
          <Card
            key={`empty-${index}`}
            className="rounded-lg relative bg-black/10 flex items-center justify-center p-4 border border-white/20 aspect-square w-full"
          />
        ))}
      </div>
    </div>
  );
}
