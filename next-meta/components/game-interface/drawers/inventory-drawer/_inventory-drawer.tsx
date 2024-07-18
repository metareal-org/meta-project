// components/game-interface/drawers/inventory-drawer/_inventory-drawer.tsx

import React from "react";
import { Card, Title } from "@/components/ui/tags";
import useDrawerStore from "@/store/gui-store/useDrawerStore";
import { XCircle } from "lucide-react";
import useSpinwheelStore from "@/store/minigame-store/useSpinwheelStore";
import useAlertStore from "@/store/gui-store/useAlertStore";
import { useUserStore } from "@/store/player-store/useUserStore";
import { MissionId } from "@/core/missions/mission-config";
import useMissionStore from "@/store/useMissionStore";
import { updateMetaAmount } from "@/lib/api/user";
import { useAssetStore } from "@/store/player-store/useAssetStore";
import { AssetData } from "@/lib/api/asset";

export default function InventoryDrawer() {
  const { inventoryDrawer, setDrawerState } = useDrawerStore();
  const { setShowSpinModal } = useSpinwheelStore();
  const { openAlert } = useAlertStore();
  const { addCp, setMetaExact } = useUserStore();
  const { setSelectedMission } = useMissionStore();
  const { updateAsset } = useAssetStore();
  const { user } = useUserStore();

  if (!inventoryDrawer) return null;
  if (!user) return null;

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

  const handleItemClick = async (name: keyof AssetData, count: number) => {
    if (count === 0) return;
    if (name === "ticket") {
      setDrawerState("inventoryDrawer", false);
      showReadyToPlayAlert();
    }
    if (name === "gift") {
      try {
        addCp(5000);
        await updateMetaAmount("add", 1000000);
        updateAsset("wood", 100);
        updateAsset("sand", 30);
        updateAsset("gift", -1);
      } catch {
      } finally {
        setMetaExact(1000000);
        openAlert({
          title: "Gift opened",
          picture: "https://placeimg.com/300/200/nature",
          description: (
            <>
              <div className="grid gap-2">
                Congratulations! You've unlocked a treasure trove of resources. Your inventory has been enriched with valuable items to aid you on your journey.
              </div>
              <div className="bg-black-1000/20 mt-4 rounded-xl w-full pt-4 flex flex-wrap items-center justify-center">
                <div className="flex-col items-center h-32 m-2">
                  <img className="!w-20 p-2 border rounded block" src="/assets/images/tokens/cp.webp" />
                  <div className="text-xs break-words text-center mt-2">5000 CP</div>
                </div>
                <div className="flex-col items-center h-32 m-2">
                  <img className="!w-20 p-2 border rounded block" src="https://placeimg.com/80/80/tech" />
                  <div className="text-xs break-words text-center mt-2">1,000,000 META</div>
                </div>
                <div className="flex-col items-center h-32 m-2">
                  <img className="!w-20 p-2 border rounded block" src="https://placeimg.com/80/80/arch" />
                  <div className="text-xs break-words text-center mt-2">100 Wood</div>
                </div>
                <div className="flex-col items-center h-32 m-2">
                  <img className="!w-20 p-2 border rounded block" src="https://placeimg.com/80/80/nature" />
                  <div className="text-xs break-words text-center mt-2">30 Sand</div>
                </div>
              </div>
            </>
          ),
          buttons: [
            {
              label: "Close",
              onClick: () => {
                setSelectedMission(MissionId.Advanture);
                setDrawerState("inventoryDrawer", false);
              },
            },
          ],
        });
      }
    }
  };

  const items = [
    {
      name: "ticket" as const,
      count: user.assets?.ticket,
      imgSrc: "/assets/images/inventory/ticket_icon.webp",
      className: "inventory-ticket-target",
    },
    {
      name: "gift" as const,
      count: user.assets?.gift,
      imgSrc: "/assets/images/inventory/gift_icon.webp",
      className: "inventory-gift-target",
    },
  ];

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
