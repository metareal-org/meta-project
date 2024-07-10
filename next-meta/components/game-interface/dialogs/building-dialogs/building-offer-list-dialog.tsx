import { Button } from "@/components/ui/button";
import { CustomDialog } from "@/components/game-interface/dialogs/_dialogs";
import useDialogStore from "@/store/gui-store/useDialogStore";
import BuildingOfferListTable from "./building-offer-list-dialog/building-offer-list-dialog-table";
import useLandStore from "@/store/world-store/useLandStore";
import { useEffect, useState } from "react";
import { fetchOffers } from "@/lib/api/offer";
import { useUserStore } from "@/store/player-store/useUserStore";
import { acceptOffer } from "@/lib/api/offer";

export default function BuildingOfferListDialog() {
  const { buildingOfferListDialog, setDialogState } = useDialogStore();
  const { currentLandDetails } = useLandStore();
  const [offers, setOffers] = useState([]);
  const [highestOffer, setHighestOffer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUserStore();

  const fetchOffersData = async () => {
    if (currentLandDetails && buildingOfferListDialog) {
      setIsLoading(true);
      setOffers([]);
      try {
        const data = await fetchOffers(currentLandDetails.id);
        setOffers(data.offers);
        setHighestOffer(data.highestOffer);
      } catch (error) {
        console.error("Error fetching offers:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  useEffect(() => {
    fetchOffersData();
  }, [currentLandDetails, buildingOfferListDialog]);

  useEffect(() => {
    if (currentLandDetails && buildingOfferListDialog) {
      setIsLoading(true);
      setOffers([]);
      fetchOffers(currentLandDetails.id)
        .then((data) => {
          setOffers(data.offers);
          setHighestOffer(data.highestOffer);
        })
        .catch((error) => {
          console.error("Error fetching offers:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [currentLandDetails, buildingOfferListDialog]);
  return (
    <CustomDialog
      open={buildingOfferListDialog}
      onOpenChange={() => setDialogState("buildingOfferListDialog", false)}
      title={`Building Offers for Plot #${currentLandDetails?.id}`}
      description="View the list of building offers for this land plot below."
    >
      <div className="grid gap-4 py-2">
        <div className="rounded-lg overflow-hidden">
          <img
            className="w-full h-auto"
            src="https://cdn.leonardo.ai/users/4073c2a5-0f7a-4cac-8fc5-fa427e42d881/generations/cc973398-2830-4653-9f2e-efb099e9ab3d/Default_empty_land_green_cute_render_0.jpg"
            alt="Empty Land"
          />
        </div>
        {highestOffer !== null && <div className="text-primary">Highest Offer: ${highestOffer}</div>}

        <div>
          <BuildingOfferListTable isLoading={isLoading} data={offers} sortable={user?.id === currentLandDetails?.owner_id} />
        </div>
      </div>
      <div className="flex justify-end">
        <Button variant="outline" onClick={() => setDialogState("buildingOfferListDialog", false)}>
          Close
        </Button>
      </div>
    </CustomDialog>
  );
}
