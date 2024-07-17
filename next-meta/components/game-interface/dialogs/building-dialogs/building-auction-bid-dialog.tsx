import { useMemo, useState, useEffect } from "react";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { CustomDialog } from "@/components/game-interface/dialogs/_dialogs";
import useDialogStore from "@/store/gui-store/useDialogStore";
import useLandStore from "@/store/world-store/useLandStore";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuctionStore } from "@/store/useAuctionStore";
import { useUserStore } from "@/store/player-store/useUserStore";
import BidsTable from "./building-auction-bid-dialog/building-auction-bid-dialog-table";

function CountdownTimer({ endTime }: { endTime: string }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = moment();
      const end = moment(endTime);
      const duration = moment.duration(end.diff(now));
      const totalDuration = moment.duration(end.diff(moment(endTime).subtract(24, "hours")));

      if (duration.asSeconds() <= 0) {
        setTimeLeft("Ended");
        setProgress(0);
        clearInterval(timer);
      } else {
        const hours = duration.hours();
        const minutes = duration.minutes();
        const seconds = duration.seconds();
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        setProgress((duration.asSeconds() / totalDuration.asSeconds()) * 100);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle className="text-gray-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="44" cx="50" cy="50" />
        <circle
          className="text-primary"
          strokeWidth="8"
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="44"
          cx="50"
          cy="50"
          style={{
            strokeDasharray: `${2 * Math.PI * 44}`,
            strokeDashoffset: `${2 * Math.PI * 44 * (1 - progress / 100)}`,
            transition: "stroke-dashoffset 1s linear",
          }}
        />
      </svg>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="font-bold text-sm">{timeLeft}</div>
      <div className="text-sm mx-auto w-max text-center">remaining</div>
      </div>
    </div>
  );
}

export default function BuildingAuctionBidDialog() {
  const { buildingAuctionBidDialog, setDialogState } = useDialogStore();
  const { currentLandDetails } = useLandStore();
  const { placeBid } = useAuctionStore();
  const [bidAmount, setBidAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useUserStore();
  const { isOwner } = useMemo(() => {
    if (!currentLandDetails) return {};
    return {
      isOwner: currentLandDetails.owner_id === user?.id,
    };
  }, [currentLandDetails, user]);

  const handlePlaceBid = async () => {
    if (!activeAuction) {
      toast({
        variant: "destructive",
        title: "No active auction",
        description: "There is no active auction for this land.",
      });
      return;
    }

    if (!bidAmount || isNaN(Number(bidAmount))) {
      toast({
        variant: "destructive",
        title: "Invalid bid amount",
        description: "Please enter a valid bid amount",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await placeBid(activeAuction.id, parseInt(bidAmount, 10));
      if (response.status === 201) {
        toast({
          variant: "success",
          title: "Bid placed",
          description: "Your bid has been placed successfully",
        });
        setDialogState("buildingAuctionBidDialog", false);
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error : any) {
      console.error("Error placing bid:", error);
      let errorTitle = "Bid Placement Failed";
      let errorMessage = "An error occurred while placing your bid. Please try again.";

      if (error.response && error.response.data) {
        errorTitle = error.response.data.error || errorTitle;
        errorMessage = error.response.data.message || errorMessage;
      }

      toast({
        variant: "destructive",
        title: errorTitle,
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeAuction = currentLandDetails?.active_auction;

  return (
    <CustomDialog
      open={buildingAuctionBidDialog}
      onOpenChange={() => setDialogState("buildingAuctionBidDialog", false)}
      title={`Place Bid - Plot #${currentLandDetails?.id}`}
      description="Enter your bid for this land auction"
    >
      <div className="grid gap-6 py-4">
        <div className="rounded-lg overflow-hidden">
          <img className="w-full h-48 object-cover object-top" src="/assets/images/drawers/building-auction-bid.png" alt="Auction Bid" />
        </div>
        {currentLandDetails && activeAuction?.bids ? (
          <div className="grid gap-6">
            <div className="grid grid-cols-3 place-items-center">
              <div className="flex flex-col items-center justify-center">
                <div className="text-sm font-semibold">Current highest bid:</div>
                <div className="text-lg font-bold">{activeAuction.bids.length > 0 ? `${activeAuction.bids[0].amount} CP` : "No bids yet"}</div>
              </div>
              <CountdownTimer endTime={activeAuction.end_time} />
              <div className="flex flex-col items-center justify-center">
                <div className="text-sm font-semibold">Minimum bid:</div>
                <div className="text-lg font-bold">
                  {activeAuction.bids.length > 0 ? `${(activeAuction.bids[0].amount * 1.05).toFixed(2)} CP` : `${activeAuction.minimum_price} CP`}
                </div>
              </div>
            </div>
            {!isOwner && (
              <div>
                <div className="text-primary text-sm mb-1">Your bid amount (CP)</div>
                <Input
                  intOnly={true}
                  className="w-full"
                  type="number"
                  placeholder="Bid Amount"
                  min={activeAuction.minimum_price}
                  step={1}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold mb-2">All Bids</h3>
              <div className="max-h-60 overflow-y-auto">
                <BidsTable />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">No active auction for this land</div>
        )}
      </div>
      {!isOwner && (
        <div className="flex justify-end gap-2 mt-6">
          <Button className="w-full" variant="outline" onClick={() => setDialogState("buildingAuctionBidDialog", false)}>
            Cancel
          </Button>
          <Button className="w-full" onClick={handlePlaceBid} disabled={isSubmitting || !activeAuction}>
            {isSubmitting ? "Placing Bid..." : "Place Bid"}
          </Button>
        </div>
      )}
    </CustomDialog>
  );
}
