import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import axiosInstance from '@/lib/axios-instance';
import { useToast } from "@/components/ui/use-toast";

interface Auction {
  id: number;
  land_id: number;
  minimum_price: number;
  start_time: string;
  end_time: string;
  status: string;
}

interface AuctionListProps {
  auctions: Auction[];
  onUpdate: () => void;
}

const AuctionList: React.FC<AuctionListProps> = ({ auctions, onUpdate }) => {
  const [selectedAuctions, setSelectedAuctions] = useState<number[]>([]);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const { toast } = useToast();

  const handleSelectAuction = (id: number) => {
    setSelectedAuctions(prev => 
      prev.includes(id) ? prev.filter(auctionId => auctionId !== id) : [...prev, id]
    );
  };

  const handleBulkCancelAuctions = async () => {
    try {
      await axiosInstance.post('/admin/manage/lands/bulk-cancel-auctions', {
        auctionIds: selectedAuctions,
      });
      toast({
        title: "Success",
        description: "Auctions canceled successfully",
      });
      setShowCancelDialog(false);
      setSelectedAuctions([]);
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel auctions",
        variant: "destructive",
      });
    }
  };

  const handleBulkRemoveAuctions = async () => {
    try {
      await axiosInstance.post('/admin/manage/lands/bulk-remove-auctions', {
        auctionIds: selectedAuctions,
      });
      toast({
        title: "Success",
        description: "Auctions removed successfully",
      });
      setShowRemoveDialog(false);
      setSelectedAuctions([]);
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove auctions",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="mb-4 space-x-2">
        <Button 
          onClick={() => setShowCancelDialog(true)} 
          disabled={selectedAuctions.length === 0}
        >
          Cancel Selected Auctions ({selectedAuctions.length})
        </Button>
        <Button 
          onClick={() => setShowRemoveDialog(true)} 
          disabled={selectedAuctions.length === 0}
          variant="destructive"
        >
          Remove Selected Auctions ({selectedAuctions.length})
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Select</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Land ID</TableHead>
            <TableHead>Minimum Price</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {auctions.map((auction) => (
            <TableRow key={auction.id}>
              <TableCell>
                <Checkbox
                  checked={selectedAuctions.includes(auction.id)}
                  onCheckedChange={() => handleSelectAuction(auction.id)}
                />
              </TableCell>
              <TableCell>{auction.id}</TableCell>
              <TableCell>{auction.land_id}</TableCell>
              <TableCell>{auction.minimum_price}</TableCell>
              <TableCell>{new Date(auction.start_time).toLocaleString()}</TableCell>
              <TableCell>{new Date(auction.end_time).toLocaleString()}</TableCell>
              <TableCell>{auction.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Selected Auctions</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to cancel {selectedAuctions.length} auctions?</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>Cancel</Button>
            <Button onClick={handleBulkCancelAuctions}>Confirm</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Selected Auctions</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to permanently remove {selectedAuctions.length} auctions? This action cannot be undone.</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowRemoveDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleBulkRemoveAuctions}>Confirm</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuctionList;