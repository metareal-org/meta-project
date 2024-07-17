import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import BuildingOfferDialog from "@/components/game-interface/dialogs/building-dialogs/building-offer-dialog";
import BuildingSellDialog from "@/components/game-interface/dialogs/building-dialogs/building-sell-dialog";
import BuildingUpdateSellDialog from "@/components/game-interface/dialogs/building-dialogs/building-update-sell-dialog";
import BuildingOfferListDialog from "@/components/game-interface/dialogs/building-dialogs/building-offer-list-dialog";
import BuildingBuyDialog from "./building-dialogs/building-buy-dialog";
import BuildingAuctionDialog from "./building-dialogs/building-auction-dialog";
import BuildingAuctionBidDialog from "./building-dialogs/building-auction-bid-dialog";
export default function Dialogs() {
  return (
    <>
      <BuildingSellDialog />
      <BuildingUpdateSellDialog />
      <BuildingOfferListDialog />
      <BuildingBuyDialog />
      <BuildingOfferDialog />
      <BuildingAuctionDialog />
      <BuildingAuctionBidDialog />
    </>
  );
}

interface CustomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function CustomDialog({ open, onOpenChange, title, description, children }: CustomDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
