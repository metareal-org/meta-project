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
import { ScrollArea } from "@/components/ui/scroll-area";
import BidsTable from "./building-auction-bid-dialog/building-auction-bid-dialog-table";

function CountdownTimer({ startTime, endTime }: { startTime: string; endTime: string }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = moment();
      const start = moment(startTime);
      const end = moment(endTime);
      const totalDuration = moment.duration(end.diff(start));
      const elapsedDuration = moment.duration(now.diff(start));
      const remainingDuration = moment.duration(end.diff(now));

      if (remainingDuration.asSeconds() <= 0) {
        setTimeLeft("Ended");
        setProgress(0);
        clearInterval(timer);
      } else {
        const days = remainingDuration.days();
        const hours = remainingDuration.hours();
        const minutes = remainingDuration.minutes();
        const seconds = remainingDuration.seconds();
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        setProgress(100 - (elapsedDuration.asSeconds() / totalDuration.asSeconds()) * 100);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, endTime]);

  const rotate = useMemo(() => `rotate(${progress * 3.6}deg)`, [progress]);

  return (
    <div className="relative w-32 h-32">
      <div className="absolute inset-0 rounded-full bg-gray-200"></div>
      <div
        className="absolute inset-0 rounded-full bg-primary"
        style={{
          clipPath: `polygon(50% 50%, 50% 0%, ${progress > 50 ? "100% 0%," : ""} ${rotate} 0%, 50% 50%)`,
          transform: "rotate(-90deg)",
        }}
      ></div>
      <div className="absolute inset-2 rounded-full bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="font-bold text-xs">{timeLeft}</div>
          <div className="text-xs">remaining</div>
        </div>
      </div>
    </div>
  );
}

const BuildingAuctionBidDialog = () => {
  const { buildingAuctionBidDialog, setDialogState } = useDialogStore();
  const { currentLandDetails, fetchLandDetails } = useLandStore();
  const { placeBid, cancelAuction } = useAuctionStore();
  const [bidAmount, setBidAmount] = useState(currentLandDetails?.minimum_bid || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useUserStore();

  const isOwner = currentLandDetails?.owner_id === user?.id;
  const activeAuction = currentLandDetails?.active_auction;
  const minimumBid = currentLandDetails?.minimum_bid || 0;

  if (!currentLandDetails) return null;

  const handlePlaceBid = async () => {
    const { fetchUser } = useUserStore.getState();
    if (!activeAuction || !bidAmount || isNaN(Number(bidAmount)) || Number(bidAmount) < minimumBid) {
      toast({
        variant: "destructive",
        title: !activeAuction ? "No active auction" : "Invalid bid amount",
        description: !activeAuction ? "There is no active auction for this land." : `Please enter a valid bid amount of at least ${minimumBid} CP`,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await placeBid(activeAuction.id, bidAmount);
      if (response.status === 201) {
        toast({
          variant: "success",
          title: "Bid placed",
          description: "Your bid has been placed successfully",
        });
        setDialogState("buildingAuctionBidDialog", false);
        fetchLandDetails(currentLandDetails.id);
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error: any) {
      console.error("Error placing bid:", error);
      toast({
        variant: "destructive",
        title: error.response?.data?.error || "Bid Placement Failed",
        description: error.response?.data?.message || "An error occurred while placing your bid. Please try again.",
      });
    } finally {
      fetchUser();
      setIsSubmitting(false);
    }
  };

  const handleCancelAuction = async () => {
    if (!activeAuction) return;
    setIsSubmitting(true);
    try {
      const response = await cancelAuction(activeAuction.id);
      if (response.status === 200) {
        toast({
          variant: "success",
          title: "Auction Canceled",
          description: "Your auction has been canceled successfully",
        });
        setDialogState("buildingAuctionBidDialog", false);
        fetchLandDetails(currentLandDetails.id);
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error: any) {
      console.error("Error canceling auction:", error);
      toast({
        variant: "destructive",
        title: "Auction Cancellation Failed",
        description: error.response?.data?.message || "An error occurred while canceling your auction. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomDialog
      open={buildingAuctionBidDialog}
      onOpenChange={() => setDialogState("buildingAuctionBidDialog", false)}
      title={`${!isOwner ? "Place Bid" : "Observe Auction"} - Plot #${currentLandDetails?.id}`}
      description={isOwner ? "Observe the auction for this land" : "Enter your bid for this land auction"}
    >
      <ScrollArea className="h-[70vh] pr-4">
        <div className="grid gap-4 ">
          <img className="w-full h-48 object-cover object-top rounded-lg" src="/assets/images/drawers/building-auction-bid.png" alt="Auction Bid" />
          {activeAuction ? (
            <div className="grid gap-2">
              <div className="grid grid-cols-3 place-items-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="text-sm font-semibold">Current highest bid:</div>
                  <div className="text-lg font-bold">{activeAuction.highest_bid ? `${activeAuction.highest_bid} CP` : "No bids yet"}</div>
                </div>
                <CountdownTimer startTime={activeAuction.start_time} endTime={activeAuction.end_time} />
                <div className="flex flex-col items-center justify-center">
                  <div className="text-sm font-semibold">Minimum bid:</div>
                  <div className="text-lg font-bold">{minimumBid} CP</div>
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
                    min={minimumBid}
                    step={1}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                  />
                </div>
              )}
              <div>
                <h3 className="font-semibold mb-1 mt-2">All Bids</h3>
                <div className="max-h-60 overflow-y-auto">
                  <BidsTable />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">No active auction for this land</div>
          )}
        </div>
      </ScrollArea>

      {!isOwner && (
        <div className="flex justify-end gap-2">
          <Button className="w-full" variant="outline" onClick={() => setDialogState("buildingAuctionBidDialog", false)}>
            Cancel
          </Button>
          <Button className="w-full" onClick={handlePlaceBid} disabled={isSubmitting || !activeAuction}>
            {isSubmitting ? "Placing Bid..." : "Place Bid"}
          </Button>
        </div>
      )}
      {isOwner && activeAuction && activeAuction.bids.length === 0 && (
        <Button className="w-max ml-auto mr-4" onClick={handleCancelAuction} variant="destructive" disabled={isSubmitting}>
          {isSubmitting ? "Canceling Auction..." : "Cancel Auction"}
        </Button>
      )}
    </CustomDialog>
  );
};

export default BuildingAuctionBidDialog;
