import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CustomDialog } from "@/components/game-interface/dialogs/_dialogs";
import useDialogStore from "@/store/gui-store/useDialogStore";
import useLandStore from "@/store/world-store/useLandStore";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/axios-instance";
import { useToast } from "@/components/ui/use-toast";
import { useMapStore } from "@/store/engine-store/useMapStore";
import { updateLandPrice, cancelLandSell } from "@/lib/api/land";
export default function BuildingUpdateSellDialog() {
  const { buildingUpdateSellDialog, setDialogState } = useDialogStore();
  const { currentLandDetails, fetchLandDetails, fetchLands } = useLandStore();
  const [price, setPrice] = useState("");
  const { mapbox } = useMapStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [priceError, setPriceError] = useState("");

  useEffect(() => {
    if (buildingUpdateSellDialog && currentLandDetails) {
      setPrice(currentLandDetails.fixed_price ? currentLandDetails.fixed_price.toString() : "");
      setPriceError("");
    }
  }, [buildingUpdateSellDialog, currentLandDetails]);

  const validatePrice = (value: string) => {
    const numValue = Number(value);
    if (isNaN(numValue) || numValue < 100 || numValue > 100000000000) {
      setPriceError("Please enter a valid price between $100 and $100,000,000,000");
      return false;
    }
    setPriceError("");
    return true;
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrice(value);
    validatePrice(value);
  };

  const handleUpdatePrice = async () => {
    if (!currentLandDetails || !validatePrice(price)) return;

    setIsSubmitting(true);
    try {
      if (!mapbox) throw new Error("Mapbox is not initialized");
      await updateLandPrice(currentLandDetails.id, Number(price));
      const bounds = mapbox.getBounds();
      const zoom = mapbox.getZoom();
      await fetchLands(bounds, zoom);
      await fetchLandDetails(currentLandDetails.id);
      toast({
        variant:"success",
        title: "Price updated",
        description: "The land price has been updated successfully",
      });
      setDialogState("buildingUpdateSellDialog", false);
    } catch (error) {
      console.error("Error updating price:", error);
      toast({
        variant: "destructive",
        title: "Failed to update price",
        description: "An error occurred while updating the price. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStopSell = async () => {
    if (!currentLandDetails) return;

    setIsSubmitting(true);
    try {
      if (!mapbox) throw new Error("Mapbox is not initialized");
      const bounds = mapbox.getBounds();
      const zoom = mapbox.getZoom();
      await cancelLandSell(currentLandDetails.id);
      await fetchLandDetails(currentLandDetails.id);
      await fetchLands(bounds, zoom);
      toast({
        variant:"success",
        title: "Sale stopped",
        description: "The land has been removed from sale",
      });
      setDialogState("buildingUpdateSellDialog", false);
    } catch (error) {
      console.error("Error stopping sale:", error);
      toast({
        variant: "destructive",
        title: "Failed to stop sale",
        description: "An error occurred while stopping the sale. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomDialog
      open={buildingUpdateSellDialog}
      onOpenChange={() => setDialogState("buildingUpdateSellDialog", false)}
      title={`Update Selling Price - Plot #${currentLandDetails?.id}`}
      description="Please enter the new selling price for this land"
    >
      <div className="grid gap-6 py-4">
        <div className="rounded-lg overflow-hidden shadow-md">
          <img className="w-full h-48 object-cover object-top" src="/assets/images/drawers/building-update-sell.png" alt="Building" />
        </div>
        <div className="grid gap-4">
          <div className="border px-4 py-2 rounded-md">
            <div>
              <span>Current price: </span>
              <span className="text-primary">${currentLandDetails?.fixed_price?.toLocaleString() ?? "N/A"}</span>
            </div>
          </div>
          <div>
            <div className="text-primary text-sm mb-1">How much would you like to sell it for?</div>

            <Input
              className="pl-4 w-full"
              type="text"
              placeholder="New price"
              value={price}
              onChange={handlePriceChange}
              aria-invalid={!!priceError}
              aria-describedby="price-error"
            />
            {priceError && (
              <p id="price-error" className="mt-1 text-sm text-red-600">
                {priceError}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="destructive" className="w-max" onClick={handleStopSell} disabled={isSubmitting}>
          {isSubmitting ? "Stopping..." : "Stop"}
        </Button>
        <Button className="w-max" onClick={handleUpdatePrice} disabled={isSubmitting || !!priceError}>
          {isSubmitting ? "Updating..." : "Update"}
        </Button>
      </div>
    </CustomDialog>
  );
}
