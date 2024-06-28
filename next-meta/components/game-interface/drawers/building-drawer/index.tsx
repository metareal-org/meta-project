import useDrawerStore from "@/store/gui-store/useDrawerStore";
import useLandStore from "@/store/world-store/useLandStore";
import BuildingButtons from "@/components/game-interface/drawers/building-drawer/building-drawer-buttons";
import BuildingSellDialog from "@/components/game-interface/dialogs/building-dialogs/building-sell-dialog";
import useDialogStore from "@/store/gui-store/useDialogStore";
import BuildingOfferListDialog from "@/components/game-interface/dialogs/building-dialogs/building-offer-list-dialog";
import BuildingUpdateSellDialog from "@/components/game-interface/dialogs/building-dialogs/building-update-sell-dialog";
import BuildingOfferDialog from "@/components/game-interface/dialogs/building-dialogs/building-offer-dialog";
import { Grid } from "@/components/ui/tags";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
interface BuildingProperties {
  fid: number;
  owner_id: number;
  forsale: boolean;
}

export default function BuildingDrawer() {
  const { buildingDrawer } = useDrawerStore();
  const { selectedLand } = useLandStore();
  if (!buildingDrawer || !selectedLand) return null;
  const { fid, owner_id, forsale } = selectedLand.properties as BuildingProperties;
  return (
    <div className="fixed z-50 inset-x-0  scale-100 origin-bottom bottom-0 mx-auto w-full max-w-sm bg-black shadow-lg rounded-t-2xl">
      <div className="relative">
        <div>
          <div className="px-4 pt-4 relative">
            <Button
              variant="ghost"
              className="absolute text-white bg-black-950 top-6 right-6 !p-2  size-8 "
              onClick={() => useDrawerStore.setState({ buildingDrawer: false })}
            >
              <X size={24} />
            </Button>
            <img
              src="https://cdn.leonardo.ai/users/4073c2a5-0f7a-4cac-8fc5-fa427e42d881/generations/2c5a4a78-1d25-4fa6-8da7-a2696e234167/Default_empty_land_green_3d_render_game_style_0.jpg"
              className="rounded-lg w-full  h-[160px] object-cover "
            />
          </div>
          <Grid className="place-items-center gap-1 mt-3">
            <h3 className="text-2xl font-semibold text-center">Building {fid}</h3>
            <div>Tehran Capital</div>
          </Grid>
          <div className="rounded-3xyl py-2">
            <div className="text-center border-t border-b text-lime border-white/50 text-xs py-2">This property is owner avaliable for buy</div>
            <section className="border-b border-white/30 py-3">
              <h3 className="text-xl text-[#90c1f7] py-1 text-center">Global Bank</h3>
            </section>
            <section className="grid -mb-2 divide-x divide-white/30 text-center  grid-cols-2">
              <div className="grid py-2">
                <div>
                  480 M<sup>2</sup>
                </div>
                <div className="text-xs">Property size</div>
              </div>
              <div className="grid py-2">
                <div>9500 Meta</div>
                <div className="text-xs">Price</div>
              </div>
            </section>
          </div>
        </div>
        <div className="w-full border-t  shadow mx-auto  ">
          <div className="flex items-center py-2 justify-center">
            <BuildingButtons owner_id={owner_id} forsale={forsale} />
          </div>
        </div>
      </div>
    </div>
  );
}
