import { Button } from "@/components/ui/button";
import useDialogStore from "@/store/gui-store/useDialogStore";
import useLandStore from "@/store/world-store/useLandStore";
import useUnitStore from "@/store/world-store/useUnitStore";
import { MouseEventHandler, ReactNode } from "react";
import { center } from "@turf/turf";

interface BuildingButtonProps {
  icon: ReactNode;
  text: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  style?: React.CSSProperties;
}

const BuildingButton = ({ icon, text, onClick, className = "", style = {} }: BuildingButtonProps) => (
  <Button
    style={style}
    className={`flex-col items-center justify-center p-4
    size-18  text-white transition duration-300 ease-out rounded-lg shadow-black/20 shadow hover:scale-105 ${className}`}
    onClick={onClick}
  >
    <div className="flex items-center justify-center">{icon}</div>
    <div className="font-semibold bg-black-950 text-xs border rounded p-1">{text}</div>
  </Button>
);

interface BuildingButtonsProps {
  owner_id: number;
  forsale: boolean;
}

const BuildingButtons = ({ owner_id, forsale }: BuildingButtonsProps) => {
  const isOwner = owner_id === 1;
  const { setDialogState } = useDialogStore();
  const { moveMarker, marker } = useUnitStore();
  const { selectedLand } = useLandStore();
  const buttonConfigs = [
    {
      style: {
        background: "linear-gradient(180deg, #50caf0 0%, #2382a5  100%)",
      },
      icon: <img src="https://cdn3d.iconscout.com/3d/premium/thumb/walk-finger-hand-gesture-10551875-8573171.png?f=webp" />,
      text: "Move",
      onClick: () => {
        const centerPoint = selectedLand?.geometry && center(selectedLand.geometry).geometry.coordinates;
        if (centerPoint) {
          const newCoordinates: [number, number] = centerPoint as [number, number];
          moveMarker(marker as mapboxgl.Marker, newCoordinates);
        } else {
          console.error("Center point is undefined");
        }
      },
      condition: true,
    },
    {
      style: {
        background: "linear-gradient(180deg, #edc240 0%, #EC8917 100%)",
      },
      icon: <img src="https://cdn3d.iconscout.com/3d/premium/thumb/gear-9562135-7800536.png?f=webp" />,
      text: "Re-Price",
      onClick: () => setDialogState("buildingUpdateSellDialog", true),
      condition: isOwner && forsale,
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
      condition: isOwner && !forsale,
    },
    {
      style: {
        background: "linear-gradient(180deg, #6DE059 0%, #1C9105 100%)",
      },
      icon: <img src="https://cdn3d.iconscout.com/3d/premium/thumb/solar-house-7303323-6000040.png?f=webp" />,
      text: "Buy",
      onClick: () => setDialogState("buildingBuyDialog", true),
      condition: !isOwner && forsale,
    },
    {
      style: {
        background: "linear-gradient(180deg, #b992f1 0%, #9456EB 100%)",
      },
      icon: <img src="https://cdn3d.iconscout.com/3d/premium/thumb/bidding-date-5886191-4897678.png?f=webp" />,
      text: "Offer",
      onClick: () => setDialogState("buildingOfferDialog", true),
      condition: !isOwner,
    },
  ];

  return <div className="flex py-4 gap-2">{buttonConfigs.map((config, index) => config.condition && <BuildingButton key={index} {...config} />)}</div>;
};

export default BuildingButtons;
