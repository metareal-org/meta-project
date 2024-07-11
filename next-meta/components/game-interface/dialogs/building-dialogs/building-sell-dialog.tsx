// components/game-interface/dialogs/building-dialogs/building-sell-dialog.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CustomDialog } from "@/components/game-interface/dialogs/_dialogs";
import useDialogStore from "@/store/gui-store/useDialogStore";
import useLandStore from "@/store/world-store/useLandStore";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useMapStore } from "@/store/engine-store/useMapStore";
import { setLandPrice } from "@/lib/api/land";
export default function BuildingSellDialog() {
  const { buildingSellDialog, setDialogState } = useDialogStore();
  const { currentLandDetails, fetchLandDetails, fetchLands } = useLandStore();
  const [price, setPrice] = useState("");
  const { mapbox } = useMapStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSetPrice = async () => {
    if (!currentLandDetails) {
      toast({
        variant: "destructive",
        title: "No land selected",
        description: "Please select a land before setting a price",
      });
      return;
    }

    if (!price || isNaN(Number(price))) {
      toast({
        variant: "destructive",
        title: "Invalid price",
        description: "Please enter a valid price",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (!mapbox) throw new Error("Mapbox is not initialized");
      const bounds = mapbox.getBounds();
      const zoom = mapbox.getZoom();
      await setLandPrice(currentLandDetails.id, Number(price));
      await fetchLands(bounds, zoom);
      await fetchLandDetails(currentLandDetails.id);
      toast({
        variant:"success",
        title: "Price set",
        description: "The land is now for sale at the set price",
      });
      setDialogState("buildingSellDialog", false);
    } catch (error) {
      console.error("Error setting price:", error);
      toast({
        variant: "destructive",
        title: "Failed to set price",
        description: "An error occurred while setting the price. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomDialog
      open={buildingSellDialog}
      onOpenChange={() => setDialogState("buildingSellDialog", false)}
      title={`Sell Building - Plot #${currentLandDetails?.id}`}
      description="Please enter the selling price for this land"
    >
      <div className="grid gap-4 py-4">
        <div className="rounded-lg overflow-hidden">
          <img className="w-full h-48 object-cover object-top" src="/assets/images/drawers/building-sell.png" alt="Building" />
        </div>
        <div className="grid gap-2">
          <div>
            <div className="text-primary text-sm mb-1">How much would you like to sell it for?</div>
            <Input
              className="w-full"
              type="number"
              placeholder="Amount"
              min={100}
              step={100}
              max={100000000000}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button className="w-full" variant="outline" onClick={() => setDialogState("buildingSellDialog", false)}>
          Cancel
        </Button>
        <Button className="w-full" onClick={handleSetPrice} disabled={isSubmitting}>
          {isSubmitting ? "Setting..." : "Set Price"}
        </Button>
      </div>
    </CustomDialog>
  );
}
