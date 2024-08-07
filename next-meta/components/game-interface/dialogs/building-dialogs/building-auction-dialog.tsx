// components/game-interface/dialogs/building-dialogs/building-auction-dialog.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CustomDialog } from "@/components/game-interface/dialogs/_dialogs";
import useDialogStore from "@/store/gui-store/useDialogStore";
import useLandStore from "@/store/world-store/useLandStore";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useMapStore } from "@/store/engine-store/useMapStore";
import { createAuction } from '@/lib/api/auction';

export default function BuildingAuctionDialog() {
  const { buildingAuctionDialog, setDialogState } = useDialogStore();
  const { currentLandDetails, fetchLandDetails, fetchLands } = useLandStore();
  const [minimumPrice, setMinimumPrice] = useState("");
  const [duration, setDuration] = useState("");
  const { mapbox } = useMapStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleCreateAuction = async () => {
    if (!currentLandDetails) {
      toast({
        variant: "destructive",
        title: "No land selected",
        description: "Please select a land before creating an auction",
      });
      return;
    }

    if (!minimumPrice || isNaN(Number(minimumPrice)) || Number(minimumPrice) < 10) {
      toast({
        variant: "destructive",
        title: "Invalid minimum price",
        description: "Please enter a valid minimum price (at least 10 CP)",
      });
      return;
    }

    if (!duration || isNaN(Number(duration)) || Number(duration) < 10) {
      toast({
        variant: "destructive",
        title: "Invalid duration",
        description: "Please enter a valid duration (at least 10 hours)",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (!mapbox) throw new Error("Mapbox is not initialized");
      const bounds = mapbox.getBounds();
      const zoom = mapbox.getZoom();
      await createAuction(currentLandDetails.id, Number(minimumPrice), Number(duration));
      await fetchLands(bounds, zoom);
      await fetchLandDetails(currentLandDetails.id);
      toast({
        variant: "success",
        title: "Auction created",
        description: "The auction for this land has been created successfully",
      });
      setDialogState("buildingAuctionDialog", false);
    } catch (error) {
      console.error("Error creating auction:", error);
      toast({
        variant: "destructive",
        title: "Failed to create auction",
        description: "An error occurred while creating the auction. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomDialog
      open={buildingAuctionDialog}
      onOpenChange={() => setDialogState("buildingAuctionDialog", false)}
      title={`Create Auction - Plot #${currentLandDetails?.id}`}
      description="Please set the minimum price and duration for this land auction"
    >
      <div className="grid gap-4 py-4">
        <div className="rounded-lg overflow-hidden">
          <img className="w-full h-48 object-cover object-top" src="/assets/images/drawers/building-auction.png" alt="Building Auction" />
        </div>
        <div className="grid gap-2">
          <div>
            <div className="text-primary text-sm mb-1">What's the minimum price for the auction?</div>
            <Input
              className="w-full"
              type="number"
              placeholder="Minimum Price (CP)"
              min={10}
              step={1}
              value={minimumPrice}
              onChange={(e) => setMinimumPrice(e.target.value)}
            />
          </div>
          <div>
            <div className="text-primary text-sm mb-1">How long should the auction last? (in hours)</div>
            <Input
              className="w-full"
              type="number"
              placeholder="Duration (hours)"
              min={10}
              step={1}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button className="w-full" variant="outline" onClick={() => setDialogState("buildingAuctionDialog", false)}>
          Cancel
        </Button>
        <Button className="w-full" onClick={handleCreateAuction} disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Auction"}
        </Button>
      </div>
    </CustomDialog>
  );
}