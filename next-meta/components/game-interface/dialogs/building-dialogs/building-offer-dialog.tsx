import { CustomDialog } from "@/components/game-interface/dialogs/_dialogs";
import useDialogStore from "@/store/gui-store/useDialogStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BuildingOfferListTable from "./building-offer-list-dialog/building-offer-list-dialog-table";

export default function BuildingOfferDialog() {
  const { buildingOfferDialog, setDialogState } = useDialogStore();

  const handleOfferConfirmClick = () => {
    setDialogState("buildingOfferDialog", false);
  };

  return (
    <CustomDialog
      open={buildingOfferDialog}
      onOpenChange={() => setDialogState("buildingOfferDialog", false)}
      title="Other Bids"
      description="Place your bid for the empty land plot."
    >
      <div className="grid gap-4 py-4">
        <div className="rounded-lg overflow-hidden">
          <img
            className="w-full h-auto"
            src="https://cdn.leonardo.ai/users/4073c2a5-0f7a-4cac-8fc5-fa427e42d881/generations/2c5a4a78-1d25-4fa6-8da7-a2696e234167/Default_empty_land_green_3d_render_game_style_0.jpg"
            alt="Empty Land"
          />
        </div>
        <div>
          <BuildingOfferListTable sortable={false} />
        </div>
        <div>
          <p className="text-primary">Your Bid</p>
          <Input className="w-full" placeholder="Your Bid" type="number" min={0} max={100000000000} step={100} />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setDialogState("buildingOfferDialog", false)}>
          Cancel
        </Button>
        <Button onClick={handleOfferConfirmClick}>Submit</Button>
      </div>
    </CustomDialog>
  );
}