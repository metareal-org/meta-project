// components/game-interface/drawers/building-drawer.tsx

import useDrawerStore from "@/store/gui-store/useDrawerStore";
import useLandStore from "@/store/world-store/useLandStore";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { X } from "lucide-react";
import BuildingButtons from "./building-drawer-buttons";
import BuildingSellDialog from "@/components/game-interface/dialogs/building-dialogs/building-sell-dialog";
import BuildingOfferListDialog from "@/components/game-interface/dialogs/building-dialogs/building-offer-list-dialog";
import BuildingUpdateSellDialog from "@/components/game-interface/dialogs/building-dialogs/building-update-sell-dialog";
import BuildingOfferDialog from "@/components/game-interface/dialogs/building-dialogs/building-offer-dialog";

const BuildingImage = ({ isLoading }: { isLoading: boolean }) =>
  isLoading ? (
    <Skeleton className="w-full h-[160px] rounded-lg" />
  ) : (
    <img
      src="https://cdn.leonardo.ai/users/4073c2a5-0f7a-4cac-8fc5-fa427e42d881/generations/2c5a4a78-1d25-4fa6-8da7-a2696e234167/Default_empty_land_green_3d_render_game_style_0.jpg"
      className="rounded-lg w-full h-[160px] object-cover"
    />
  );

const BuildingHeader = ({ isLoading, id }: { isLoading: boolean; id?: number }) =>
  isLoading ? <Skeleton className="h-6 mx-auto w-4/5" /> : <h3 className="text-2xl mb-2 text-center">Building {id}</h3>;

const SaleStatus = ({ isLoading, isForSale, price }: { isLoading: boolean; isForSale?: boolean; price?: number | null }) =>
  isLoading ? (
    <Skeleton className="h-8 mx-auto w-2/5 my-2" />
  ) : (
    <div className="text-center border-t border-b text-lime border-white/50 text-xs py-2">
      {isForSale ? `This property is available for purchase at ${price} Meta` : "This property is not for sale"}
    </div>
  );

const OwnerSection = ({ isLoading, ownerNickname }: { isLoading: boolean; ownerNickname?: string }) => (
  <section className="border-b border-white/30 py-3">
    {isLoading ? <Skeleton className="h-6 w-1/2 mx-auto" /> : <h3 className="text-xl text-[#90c1f7] py-1 text-center">{ownerNickname}</h3>}
  </section>
);

const PropertyDetails = ({ isLoading, size, price }: { isLoading: boolean; size?: number; price?: number | null }) => (
  <section className="grid -mb-2 divide-x divide-white/30 text-center grid-cols-2">
    <div className="grid py-2">
      {isLoading ? (
        <>
          <Skeleton className="h-4 w-1/2 mx-auto mb-1" />
          <Skeleton className="h-3 w-3/4 mx-auto" />
        </>
      ) : (
        <>
          <div>
            {size} M<sup>2</sup>
          </div>
          <div className="text-xs">Property size</div>
        </>
      )}
    </div>
    <div className="grid py-2">
      {isLoading ? (
        <>
          <Skeleton className="h-4 w-1/2 mx-auto mb-1" />
          <Skeleton className="h-3 w-3/4 mx-auto" />
        </>
      ) : (
        <>
          <div>{price ? `${price} Meta` : "Not for sale"}</div>
          <div className="text-xs">Price</div>
        </>
      )}
    </div>
  </section>
);

export default function BuildingDrawer() {
  const { buildingDrawer, setDrawerState } = useDrawerStore();
  const { selectedLand, currentLandDetails } = useLandStore();

  const isLoading = !currentLandDetails;

  if (!buildingDrawer || !selectedLand) return null;

  return (
    <div className="fixed z-50 inset-x-0 scale-100 origin-bottom bottom-0 mx-auto w-full max-w-sm bg-black shadow-lg rounded-t-2xl">
      <div className="relative">
        <div className="px-4 pt-4 relative">
          <Button
            variant="ghost"
            className="absolute text-white bg-black-950 top-6 right-6 !p-2 size-8"
            onClick={() => setDrawerState("buildingDrawer", false)}
          >
            <X size={24} />
          </Button>
          <BuildingImage isLoading={isLoading} />
        </div>
        <div className="rounded-3xyl py-2">
          <BuildingHeader isLoading={isLoading} id={currentLandDetails?.id} />
          <SaleStatus isLoading={isLoading} isForSale={currentLandDetails?.is_for_sale} price={currentLandDetails?.fixed_price} />
          <OwnerSection isLoading={isLoading} ownerNickname={currentLandDetails?.owner_nickname} />
          <PropertyDetails isLoading={isLoading} size={currentLandDetails?.size} price={currentLandDetails?.fixed_price} />
        </div>
        <div className="w-full border-t shadow mx-auto">
          <div className="flex items-center py-2 justify-center">
            {isLoading ? <Skeleton className="h-10 w-3/4" /> : currentLandDetails && <BuildingButtons landDetails={currentLandDetails} />}
          </div>
        </div>
      </div>
      <BuildingSellDialog />
      <BuildingOfferListDialog />
      <BuildingUpdateSellDialog />
      <BuildingOfferDialog />
    </div>
  );
}
