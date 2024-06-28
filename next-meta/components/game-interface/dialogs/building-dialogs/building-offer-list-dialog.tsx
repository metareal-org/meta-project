import { Button } from "@/components/ui/button";
import { CustomDialog } from "@/components/game-interface/dialogs/_dialogs";
import useDialogStore from "@/store/gui-store/useDialogStore";
import BuildingOfferListTable from "./building-offer-list-dialog/building-offer-list-dialog-table";

export default function BuildingOfferListDialog() {
  const { buildingOfferListDialog, setDialogState } = useDialogStore();

  return (
    <CustomDialog
      open={buildingOfferListDialog}
      onOpenChange={() => setDialogState("buildingOfferListDialog", false)}
      title="Building Offers for Plot #123"
      description="View the list of building offers for this land plot below."
    >
      <div className="grid gap-4 py-4">
        <div className="rounded-lg overflow-hidden">
          <img
            className="w-full h-auto"
            src="https://cdn.leonardo.ai/users/4073c2a5-0f7a-4cac-8fc5-fa427e42d881/generations/cc973398-2830-4653-9f2e-efb099e9ab3d/Default_empty_land_green_cute_render_0.jpg"
            alt="Empty Land"
          />
        </div>
        <div className="mt-2">
          <BuildingOfferListTable />
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
