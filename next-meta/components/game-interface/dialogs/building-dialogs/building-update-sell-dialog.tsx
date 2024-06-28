import { Button } from "@/components/ui/button";
import { CustomDialog } from "@/components/game-interface/dialogs/_dialogs";
import useDialogStore from "@/store/gui-store/useDialogStore";
import { Input } from "@/components/ui/input";

export default function BuildingUpdateSellDialog() {
  const { buildingUpdateSellDialog, setDialogState } = useDialogStore();
  return (
    <CustomDialog
      open={buildingUpdateSellDialog}
      onOpenChange={() => setDialogState("buildingUpdateSellDialog", false)}
      title="Update Selling Price - Building 1040"
      description="Please enter the new selling price for Building"
    >
      <div className="grid gap-4 py-4">
        <div className="rounded-lg overflow-hidden">
          <img className="w-full h-48 object-cover" src="\assets\images\drawers\building-update-sell.png" alt="Building 1040" />
        </div>
        <div className="grid gap-4">
          <div>
            <p className="text-primary">How much would you like to sell it for?</p>
            <Input className="w-full" type="number" placeholder="Enter new selling price" min={100} step={100} max={100000000000} />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button className="w-full" variant="outline" onClick={() => setDialogState("buildingUpdateSellDialog", false)}>
          Cancel
        </Button>
        <Button className="w-full" onClick={() => setDialogState("buildingUpdateSellDialog", false)}>
          Set New Price
        </Button>
      </div>
    </CustomDialog>
  );
}
