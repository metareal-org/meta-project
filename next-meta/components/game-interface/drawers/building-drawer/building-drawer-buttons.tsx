import { Button } from "@/components/ui/button";
import useDialogStore from "@/store/gui-store/useDialogStore";
import useLandStore, { Land } from "@/store/world-store/useLandStore";
import useUnitStore from "@/store/world-store/useUnitStore";
import { useUserStore } from "@/store/player-store/useUserStore";
import { MouseEventHandler, ReactNode, useState, useMemo, useEffect } from "react";
import { apiUpdateUser } from "@/lib/api/user";

interface BuildingButtonProps {
  icon: ReactNode;
  text: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

const BuildingButton = ({ icon, text, onClick, className = "", style = {}, disabled = false }: BuildingButtonProps) => (
  <Button
    style={style}
    className={`flex-col items-center justify-center p-4
    size-18 text-white transition duration-300 ease-out rounded-lg shadow-black/20 shadow hover:scale-105 ${className}
    ${disabled ? "grayscale pointer-events-none" : ""}`}
    onClick={onClick}
    disabled={disabled}
  >
    <div className="flex items-center justify-center">{icon}</div>
    <div className="font-semibold bg-black-950 text-xs border rounded p-1">{text}</div>
  </Button>
);

const BuildingButtons = () => {
  const [isMoveButtonDisabled, setIsMoveButtonDisabled] = useState(false);
  const { setDialogState } = useDialogStore();
  const { moveMarker, marker } = useUnitStore();
  const { currentLandDetails } = useLandStore();
  const { user } = useUserStore();

  const { isOwner, isForSale , isLocked } = useMemo(() => {
    if (!currentLandDetails) return {};
    return {
      isOwner: currentLandDetails.owner_id === user?.id,
      isForSale: currentLandDetails.is_for_sale,
      isLocked: currentLandDetails.is_locked
    };
  }, [currentLandDetails, user]);

  const buttonConfigs = [
    {
      style: {
        background: "linear-gradient(180deg, #50caf0 0%, #2382a5  100%)",
      },
      icon: <img src="https://cdn3d.iconscout.com/3d/premium/thumb/walk-finger-hand-gesture-10551875-8573171.png?f=webp" />,
      text: "Move",
      onClick: () => {
        if (!currentLandDetails) return;
        setIsMoveButtonDisabled(true);
        const centerPointString = currentLandDetails.center_point;

        if (centerPointString) {
          try {
            const centerPoint = JSON.parse(centerPointString);
            console.log("Center point:", centerPoint);
            const newCoordinates: [number, number] = [centerPoint.longitude, centerPoint.latitude];

            apiUpdateUser({ coordinates: JSON.stringify(newCoordinates) })
              .then(() => {
                moveMarker(marker as mapboxgl.Marker, newCoordinates);
              })
              .catch((e) => {
                console.error(e);
              })
              .finally(() => {
                setIsMoveButtonDisabled(false);
              });
          } catch (error) {
            console.log(error);
            setIsMoveButtonDisabled(false);
          }
        } else {
          console.error("Center point is undefined");
          setIsMoveButtonDisabled(false);
        }
      },
      condition: true,
      disabled: isMoveButtonDisabled,
    },
    {
      style: {
        background: "linear-gradient(180deg, #779EEC 0%, #3c71de 100%)",
      },
      icon: <img src="https://cdn3d.iconscout.com/3d/premium/thumb/offer-folder-6842108-5604502.png?f=webp" />,
      text: "Offers",
      onClick: () => setDialogState("buildingOfferListDialog", true),
      condition: isOwner,
    },
    {
      style: {
        background: "linear-gradient(180deg, #FF5258 0%, #C7262C 100%)",
      },
      icon: <img src="https://cdn3d.iconscout.com/3d/premium/thumb/financial-startup-8663166-6945082.png?f=webp" />,
      text: "Sell",
      onClick: () => setDialogState("buildingSellDialog", true),
      condition: isOwner && !isForSale && !currentLandDetails?.has_active_auction,
    },
    {
      style: {
        background: "linear-gradient(180deg, #edc240 0%, #EC8917 100%)",
      },
      icon: <img src="https://cdn3d.iconscout.com/3d/premium/thumb/gear-9562135-7800536.png?f=webp" />,
      text: "Re-Price",
      onClick: () => setDialogState("buildingUpdateSellDialog", true),
      condition: isOwner && isForSale,
    },
    {
      style: {
        background: "linear-gradient(180deg, #6DE059 0%, #1C9105 100%)",
      },
      icon: <img src="https://cdn3d.iconscout.com/3d/premium/thumb/solar-house-7303323-6000040.png?f=webp" />,
      text: "Buy",
      onClick: () => setDialogState("buildingBuyDialog", true),
      condition: !isOwner && isForSale,
    },
    {
      style: {
        background: "linear-gradient(180deg, #b992f1 0%, #9456EB 100%)",
      },
      icon: <img src="https://cdn3d.iconscout.com/3d/premium/thumb/bidding-date-5886191-4897678.png?f=webp" />,
      text: "Offer",
      onClick: () => setDialogState("buildingOfferDialog", true),
      condition: !isOwner && !isLocked,
    },

    {
      style: {
        background: !isOwner ? "linear-gradient(180deg, #9900FF 0%, #6600FF 100%)" : "linear-gradient(180deg, #f8e3ae 0%, #ca8067 100%)",
      },
      icon: <img src="https://cdn3d.iconscout.com/3d/premium/thumb/hand-holding-auction-bid-board-4710526-3932217.png?f=webp" />,
      text: isOwner ? "Auction" : "Join Auction",
      onClick: () => setDialogState("buildingAuctionBidDialog", true),
      condition: currentLandDetails?.has_active_auction,
    },
    {
      style: {
        background: "linear-gradient(180deg, #FF9900 0%, #FF6600 100%)",
      },
      icon: <img src="https://cdn3d.iconscout.com/3d/premium/thumb/auction-6813960-5603563.png?f=webp" />,
      text: "Create Auction",
      onClick: () => setDialogState("buildingAuctionDialog", true),
      condition: isOwner && !isForSale && !currentLandDetails?.has_active_auction,
    },
  ];

  const availableButtons = buttonConfigs.filter((config) => config.condition);

  return (
    <div className="flex py-4 gap-2 justify-center">
      {availableButtons.map((config, index) => (
        <BuildingButton key={index} {...config} disabled={config.disabled} />
      ))}
    </div>
  );
};

export default BuildingButtons;
