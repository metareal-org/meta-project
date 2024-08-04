import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CustomDialog } from "@/components/game-interface/dialogs/_dialogs";
import useDialogStore from "@/store/gui-store/useDialogStore";
import useLandStore from "@/store/world-store/useLandStore";
import useTransactionStore from "@/store/player-store/useTransactionStore";
import { useUserStore } from "@/store/player-store/useUserStore";
import { useToast } from "@/components/ui/use-toast";

export default function BuildingBuyDialog() {
  const { buildingBuyDialog, setDialogState } = useDialogStore();
  const { currentLandDetails, fetchLandDetails } = useLandStore();
  const { buyLand, buyingLand } = useTransactionStore();
  const { user, getAssetAmount } = useUserStore();
  const { toast } = useToast();

  useEffect(() => {
    if (buildingBuyDialog && currentLandDetails?.id) {
      fetchLandDetails(currentLandDetails.id);
    }
  }, [buildingBuyDialog, currentLandDetails?.id, fetchLandDetails]);

  if (!buildingBuyDialog || !currentLandDetails) return null;

  const handleBuy = async () => {
    if (currentLandDetails.id) {
      try {
        await buyLand(currentLandDetails.id);
        toast({
          variant: "success",
          title: "Purchase Successful",
          description: `You have successfully purchased Land ${currentLandDetails.id}`,
        });
        setDialogState("buildingBuyDialog", false);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Purchase Failed",
          description: "There was an error while trying to purchase the land. Please try again.",
        });
      }
    }
  };

  const bnbAmount = getAssetAmount('bnb');
  const canBuy = currentLandDetails.is_for_sale && bnbAmount >= (currentLandDetails.fixed_price || 0);
  console.log(currentLandDetails);
  return (
    <CustomDialog
      open={buildingBuyDialog}
      onOpenChange={() => setDialogState("buildingBuyDialog", false)}
      title={`Building ${currentLandDetails.id}`}
      description="Discover the details of this stunning property and make it yours today!"
    >
      <div className="grid gap-4 py-4">
        <div className="rounded-lg overflow-hidden">
          <img className="w-full h-auto" src="/assets/images/drawers/building-buy.png" alt="Building" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-primary">Land Name:</p>
            <p className="text-black-50 ">{"Land " + currentLandDetails.id || "N/A"}</p>
          </div>
          <div>
            <p className="text-primary">Land Owner:</p>
            <p className="text-black-50 ">{currentLandDetails.owner_nickname || "N/A"}</p>
          </div>
          <div>
            <p className="text-primary">Land Size:</p>
            <p className="text-black-50 ">
              {currentLandDetails.size} M<sup>2</sup>
            </p>
          </div>
          <div>
            <p className="text-primary">Land Price:</p>
            <p className="text-black-50 ">${currentLandDetails.fixed_price || "N/A"}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button className="w-full" variant="outline" onClick={() => setDialogState("buildingBuyDialog", false)}>
          Cancel
        </Button>
        <Button 
          className="w-full" 
          onClick={handleBuy} 
          disabled={!canBuy || buyingLand}
        >
          {buyingLand ? "Buying..." : canBuy ? "Buy" : "Not Available"}
        </Button>
      </div>
    </CustomDialog>
  );
}