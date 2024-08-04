import React, { useMemo } from "react";
import { LandWithDetails } from "@/store/world-store/useLandStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Edit, ShoppingCart, HandCoins, Gavel, User, Tag, Ticket } from "lucide-react";
import useLandStore from "@/store/world-store/useLandStore";

interface LandGridProps {
  lands: LandWithDetails[];
  loading: boolean;
  activeTab: string;
  user: any;
  setDialogState: (dialog: string, state: boolean) => void;
}

const LandGrid: React.FC<LandGridProps> = ({ lands, loading, user, setDialogState }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {lands.map((land) => (
        <LandCard key={land.id} land={land} user={user} setDialogState={setDialogState} />
      ))}
    </div>
  );
};

const SkeletonCard = () => (
  <Card className="overflow-hidden">
    <CardHeader className="p-0">
      <Skeleton className="w-full h-48" />
    </CardHeader>
    <CardContent className="p-4">
      <Skeleton className="h-6 w-2/3 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-2" />
      <Skeleton className="h-6 w-1/3" />
    </CardContent>
    <CardFooter className="p-4 pt-0">
      <Skeleton className="h-8 w-full" />
    </CardFooter>
  </Card>
);

const LandCard = ({ land, user, setDialogState } : { land: LandWithDetails, user: any, setDialogState: (dialog: string, state: boolean) => void }) => {
  const { setSelectedLandId } = useLandStore();

  const { isOwner, isForSale, isLocked } = useMemo(
    () => ({
      isOwner: land.owner_id === user?.id,
      isForSale: land.is_for_sale,
      isLocked: land.is_locked,
    }),
    [land, user]
  );

  const handleButtonClick = (dialogName: string) => {
    setSelectedLandId(land.id);
    setDialogState(dialogName, true);
  };

  const buttonConfigs = [
    {
      icon: <Tag className="w-4 h-4" />,
      text: "Offers",
      onClick: () => handleButtonClick("buildingOfferListDialog"),
      condition: isOwner,
      variant: "secondary",
      priority: 1,
    },
    {
      icon: <DollarSign className="w-4 h-4" />,
      text: "Sell",
      onClick: () => handleButtonClick("buildingSellDialog"),
      condition: isOwner && !isForSale && !land.has_active_auction,
      variant: "default",
      priority: 2,
    },
    {
      icon: <Edit className="w-4 h-4" />,
      text: "Re-Price",
      onClick: () => handleButtonClick("buildingUpdateSellDialog"),
      condition: isOwner && isForSale,
      variant: "outline",
      priority: 3,
    },
    {
      icon: <ShoppingCart className="w-4 h-4" />,
      text: "Buy",
      onClick: () => handleButtonClick("buildingBuyDialog"),
      condition: !isOwner && isForSale,
      variant: "default",
      priority: 1,
    },
    {
      icon: <HandCoins className="w-4 h-4" />,
      text: "Offer",
      onClick: () => handleButtonClick("buildingOfferDialog"),
      condition: !isOwner && !isLocked,
      variant: "outline",
      priority: 2,
    },
    {
      icon: <Ticket className="w-4 h-4" />,
      text: isOwner ? "Auction" : "Join Auction",
      onClick: () => handleButtonClick("buildingAuctionBidDialog"),
      condition: land.has_active_auction,
      variant: "secondary",
      priority: 1,
    },
    {
      icon: <Gavel className="w-4 h-4" />,
      text: "Create Auction",
      onClick: () => handleButtonClick("buildingAuctionDialog"),
      condition: isOwner && !isForSale && !land.has_active_auction,
      variant: "outline",
      priority: 4,
    },
  ];

  const availableButtons = buttonConfigs
    .filter((config) => config.condition)
    .sort((a, b) => a.priority - b.priority);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative">
          <img
            src="/assets/images/buildings/building-empty.png"
            alt={`Land ${land.full_id}`}
            className="w-full h-48 object-cover"
          />
          <Badge className="absolute top-2 left-2 bg-black/60 text-white">
            {land.size} m²
          </Badge>
          {isForSale && (
            <Badge className="absolute top-2 right-2 bg-green-500">
              For Sale
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold mb-2">
          Land #{land.id}
        </CardTitle>
        <div className="text-sm text-gray-500 mb-2">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            {land.owner_nickname}
          </div>
        </div>
        {land.fixed_price && (
          <div className="text-lg font-semibold text-green-600">
            {land.fixed_price} BNB
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
        {availableButtons.map((config, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={config.variant as any}
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={config.onClick}
                >
                  {config.icon}
                  <span className="hidden sm:inline">{config.text}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{config.text}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </CardFooter>
    </Card>
  );
};

export default LandGrid;