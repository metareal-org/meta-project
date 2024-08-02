import { useState, useEffect } from "react";
import { CustomDialog } from "@/components/game-interface/dialogs/_dialogs";
import useDialogStore from "@/store/gui-store/useDialogStore";
import useLandStore from "@/store/world-store/useLandStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Loader2 } from "lucide-react";
import { useUserStore } from "@/store/player-store/useUserStore";
import { usePlayerOffersStore } from "@/store/player-store/usePlayerOffersStore";

export default function BuildingOfferDialog() {
  const { buildingOfferDialog, setDialogState } = useDialogStore();
  const { currentLandDetails } = useLandStore();
  const [offerPrice, setOfferPrice] = useState("");
  const { fetchUser } = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { submitOffer, updateOffer, deleteOffer } = usePlayerOffersStore();
  const { playerOffers, fetchPlayerOffers, updateOffer: updateStoreOffer, isLoading } = usePlayerOffersStore();

  const user_offer = playerOffers.find((offer) => offer.land_id === currentLandDetails?.id);

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
    const offerPriceNumber = Number(offerPrice);
    if (!offerPrice || isNaN(offerPriceNumber)) {
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
        await updateOffer(user_offer.id, offerPriceNumber);
      } else {
        await submitOffer(currentLandDetails.id, offerPriceNumber);
        fetchPlayerOffers(); 
      }
      toast({
        variant: "success",
        title: user_offer ? "Offer updated" : "Offer placed",
        description: user_offer ? "Your offer has been updated successfully" : "Your offer has been placed successfully",
      });
      fetchUser();
    } catch (error) {
      console.error("Error submitting/updating offer:", error);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "Failed to place/update offer. Please try again.",
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
      toast({
        variant: "success",
        title: "Offer canceled",
        description: "Your offer has been canceled successfully",
      });
      setOfferPrice("");
      fetchUser();
      fetchPlayerOffers(); // Refetch offers after deletion
    } catch (error) {
      console.error("Error deleting offer:", error);
      toast({
        variant: "destructive",
        title: "Withdrawal failed",
        description: "Failed to remove offer. Please try again.",
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
      description="Make a competitive offer for this prime property."
    >
      <div>
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img
            className="w-full h-48 object-cover"
            src="/assets/images/buldings/building-empty.png"
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
              {isLoading ? (
                <div className="flex items-center justify-center gap-2 p-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading offer...</span>
                </div>
              ) : user_offer ? (
                <div className="flex border-t pt-2 justify-between items-center">
                  <span className="text-sm font-medium flex items-center gap-2">Your Current Offer:</span>
                  <span className="font-semibold text-blue-500">${user_offer.price.toLocaleString()}</span>
                </div>
              ) : (
                <div className="flex border items-center justify-center gap-2 p-2 rounded-md">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">You haven't placed an offer yet</span>
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
          <Button variant="destructive" onClick={handleDeleteOffer} disabled={isSubmitting || isLoading}>
            Remove
          </Button>
        )}
        <Button
          onClick={handleSubmitOffer}
          disabled={isSubmitting || !currentLandDetails || isLoading}
          className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary transition-all duration-300"
        >
          {isSubmitting ? "Processing..." : user_offer ? "Update Offer" : "Place Offer"}
        </Button>
      </div>
    </CustomDialog>
  );
}