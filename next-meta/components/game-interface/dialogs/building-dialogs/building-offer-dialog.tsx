import { useState, useEffect } from "react";
import { CustomDialog } from "@/components/game-interface/dialogs/_dialogs";
import useDialogStore from "@/store/gui-store/useDialogStore";
import useLandStore from "@/store/world-store/useLandStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";
import { submitOffer, updateOffer, deleteOffer } from "@/lib/api/offer";
import { useUserStore } from "@/store/player-store/useUserStore";
import { usePlayerOffersStore } from "@/store/player-store/usePlayerOffersStore";

export default function BuildingOfferDialog() {
  const { buildingOfferDialog, setDialogState } = useDialogStore();
  const { currentLandDetails } = useLandStore();
  const [offerPrice, setOfferPrice] = useState("");
  const { fetchUserData } = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { 
    playerOffers, 
    fetchPlayerOffers, 
    updateOffer: updateStoreOffer, 
    removeOffer: removeStoreOffer 
  } = usePlayerOffersStore();

  const user_offer = playerOffers.find(offer => offer.land_id === currentLandDetails?.id);

  useEffect(() => {
    if (currentLandDetails && buildingOfferDialog) {
      fetchPlayerOffers();
    }
  }, [currentLandDetails, buildingOfferDialog, fetchPlayerOffers]);

  useEffect(() => {
    if (user_offer) {
      setOfferPrice(user_offer.price.toString());
    } else {
      setOfferPrice("");
    }
  }, [user_offer]);

  const handleSubmitOffer = async () => {
    if (!currentLandDetails) {
      toast({
        variant: "destructive",
        title: "No land selected",
        description: "Please select a land before submitting an offer",
      });
      return;
    }
    if (!offerPrice || isNaN(Number(offerPrice))) {
      toast({
        variant: "destructive",
        title: "Invalid offer",
        description: "Please enter a valid offer price",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      if (user_offer) {
        const updatedOffer = await updateOffer(user_offer.id, Number(offerPrice));
        updateStoreOffer(user_offer.id, updatedOffer);
      } else {
        const newOffer = await submitOffer(currentLandDetails.id, Number(offerPrice));
        fetchPlayerOffers(); // Refetch all offers to include the new one
      }
      toast({
        variant:"success",
        title: user_offer ? "Bid updated" : "Bid placed",
        description: user_offer ? "Your bid has been updated successfully" : "Your bid has been placed successfully",
      });
      fetchUserData(); // Fetch updated balance after offer submission/update
    } catch (error) {
      console.error("Error submitting/updating offer:", error);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "Failed to place/update bid. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteOffer = async () => {
    if (!user_offer) return;
    setIsSubmitting(true);
    try {
      await deleteOffer(user_offer.id);
      removeStoreOffer(user_offer.id);
      toast({
        variant:"success",
        title: "Bid canceled",
        description: "Your bid has been canceled successfully",
      });
      setOfferPrice("");
      fetchUserData(); 
    } catch (error) {
      console.error("Error deleting offer:", error);
      toast({
        variant: "destructive",
        title: "Withdrawal failed",
        description: "Failed to withdraw bid. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomDialog
      open={buildingOfferDialog}
      onOpenChange={() => setDialogState("buildingOfferDialog", false)}
      title="Submit Your Offer"
      description="Make a competitive bid for this prime property."
    >
      <div>
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img
            className="w-full h-48 object-cover"
            src="https://cdn.leonardo.ai/users/4073c2a5-0f7a-4cac-8fc5-fa427e42d881/generations/2c5a4a78-1d25-4fa6-8da7-a2696e234167/Default_empty_land_green_3d_render_game_style_0.jpg"
            alt="Property"
          />
        </div>

        {currentLandDetails && (
          <div className="bg-gradient-to-r from-secondary/20 to-primary/20  rounded-lg my-2">
            <div className="flex justify-between mb-1 items-center">
              <span className="text-sm font-medium">Land ID:</span>
              <span className="font-semibold text-primary">{currentLandDetails.id}</span>
            </div>

            <div className="space-y-2">
              {user_offer ? (
                <div className="flex border-t pt-2 justify-between items-center">
                  <span className="text-sm font-medium flex items-center gap-2">Your Current Bid:</span>
                  <span className="font-semibold text-blue-500">${user_offer.price.toLocaleString()}</span>
                </div>
              ) : (
                <div className="flex border items-center justify-center gap-2 p-2 rounded-md">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">You haven't placed a bid yet</span>
                </div>
              )}
            </div>
          </div>
        )}
        <div>
          <label htmlFor="offerPrice" className="block text-sm font-medium mb-2">
            Your Offer Amount
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <Input
              id="offerPrice"
              className="pl-7 pr-12 text-lg"
              placeholder="0.00"
              type="number"
              min={0}
              max={100000000000}
              step={100}
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm">USD</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={() => setDialogState("buildingOfferDialog", false)}>
          Cancel
        </Button>
        {user_offer && (
          <Button variant="destructive" onClick={handleDeleteOffer} disabled={isSubmitting}>
            Remove
          </Button>
        )}
        <Button
          onClick={handleSubmitOffer}
          disabled={isSubmitting || !currentLandDetails}
          className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary transition-all duration-300"
        >
          {isSubmitting ? "Processing..." : user_offer ? "Update Bid" : "Place Bid"}
        </Button>
      </div>
    </CustomDialog>
  );
}