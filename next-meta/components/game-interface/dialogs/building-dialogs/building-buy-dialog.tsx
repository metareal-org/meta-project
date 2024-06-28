import { Button } from "@/components/ui/button";
import { CustomDialog } from "@/components/game-interface/dialogs/_dialogs";
import useDialogStore from "@/store/gui-store/useDialogStore";

export default function BuildingBuyDialog() {
  const { buildingBuyDialog, setDialogState } = useDialogStore();
  return (
    <CustomDialog
      open={buildingBuyDialog}
      onOpenChange={() => setDialogState("buildingBuyDialog", false)}
      title="Building 1040"
      description="Discover the details of this stunning property and make it yours today!"
    >
      <div className="grid gap-4 py-4">
        <div className="rounded-lg overflow-hidden">
          <img className="w-full h-auto" src="assets/images/drawers/building-buy.png" alt="Building" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-primary">Land Name:</p>
            <p className="text-black-50 font-semibold">Sunny Acres</p>
          </div>
          <div>
            <p className="text-primary">Land Owner:</p>
            <p className="text-black-50 font-semibold">John Doe</p>
          </div>
          <div>
            <p className="text-primary">Land Size:</p>
            <p className="text-black-50 font-semibold">1,500 sq. ft.</p>
          </div>
          <div>
            <p className="text-primary">Land Price:</p>
            <p className="text-black-50 font-semibold">$250,000</p>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button className="w-full" variant="outline" onClick={() => setDialogState("buildingBuyDialog", false)}>
          Cancel
        </Button>
        <Button className="w-full" onClick={() => setDialogState("buildingBuyDialog", false)}>
          Buy
        </Button>
      </div>
    </CustomDialog>
  );
}
