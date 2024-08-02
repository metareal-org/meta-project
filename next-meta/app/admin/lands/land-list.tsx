import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import axiosInstance from "@/lib/axios-instance";
import { useToast } from "@/components/ui/use-toast";

interface Land {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  owner_id: number;
  owner_nickname: string;
  fixed_price: number | null;
  is_for_sale: boolean;
  size: number;
}

interface LandListProps {
  lands: Land[];
  onUpdate: () => void;
}

const LandList: React.FC<LandListProps> = ({ lands, onUpdate }) => {
  const [selectedLands, setSelectedLands] = useState<number[]>([]);
  const [fixedPrice, setFixedPrice] = useState<number>(0);
  const [pricePerSize, setPricePerSize] = useState<number>(0);
  const [showBulkEditDialog, setShowBulkEditDialog] = useState(false);
  const [showAuctionDialog, setShowAuctionDialog] = useState(false);
  const [auctionMinPrice, setAuctionMinPrice] = useState<number>(0);
  const [auctionStartTime, setAuctionStartTime] = useState<string>("");
  const [auctionEndTime, setAuctionEndTime] = useState<string>("");
  const { toast } = useToast();

  const handleSelectLand = (id: number) => {
    setSelectedLands((prev) => (prev.includes(id) ? prev.filter((landId) => landId !== id) : [...prev, id]));
  };
  const handleBulkCreateAuctions = async () => {
    try {
      await axiosInstance.post("/admin/manage/lands/bulk-create-auctions", {
        landIds: selectedLands,
        minimumPrice: auctionMinPrice,
        startTime: auctionStartTime,
        endTime: auctionEndTime,
      });
      toast({
        title: "Success",
        description: "Auctions created successfully",
      });
      setShowAuctionDialog(false);
      setSelectedLands([]);
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create auctions",
        variant: "destructive",
      });
    }
  };
  const handleBulkUpdateFixedPrice = async () => {
    try {
      await axiosInstance.post("/admin/manage/lands/bulk-update-fixed-price", {
        landIds: selectedLands,
        fixedPrice: fixedPrice,
      });
      toast({
        title: "Success",
        description: "Lands updated successfully with fixed price",
      });
      setShowBulkEditDialog(false);
      setSelectedLands([]);
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update lands",
        variant: "destructive",
      });
    }
  };

  const handleBulkUpdatePriceBySize = async () => {
    try {
      await axiosInstance.post("/admin/manage/lands/bulk-update-price-by-size", {
        landIds: selectedLands,
        pricePerSize: pricePerSize,
      });
      toast({
        title: "Success",
        description: "Lands updated successfully with price by size",
      });
      setShowBulkEditDialog(false);
      setSelectedLands([]);
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update lands",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="mb-4 space-x-2">
        <Button onClick={() => setShowBulkEditDialog(true)} disabled={selectedLands.length === 0}>
          Edit Lands ({selectedLands.length})
        </Button>
        <Button onClick={() => setShowAuctionDialog(true)} disabled={selectedLands.length === 0}>
          Create Auctions ({selectedLands.length})
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Select</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Latitude</TableHead>
            <TableHead>Longitude</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Fixed Price</TableHead>
            <TableHead>For Sale</TableHead>
            <TableHead>Size</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lands.map((land) => (
            <TableRow key={land.id}>
              <TableCell>
                <Checkbox checked={selectedLands.includes(land.id)} onCheckedChange={() => handleSelectLand(land.id)} />
              </TableCell>
              <TableCell>{land.id}</TableCell>
              <TableCell>{land.name}</TableCell>
              <TableCell>{land.latitude}</TableCell>
              <TableCell>{land.longitude}</TableCell>
              <TableCell>{land.owner_nickname}</TableCell>
              <TableCell>{land.fixed_price}</TableCell>
              <TableCell>{land.is_for_sale ? "Yes" : "No"}</TableCell>
              <TableCell>{land.size}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={showBulkEditDialog} onOpenChange={setShowBulkEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Edit Lands</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="fixed_price">Fixed Price</label>
              <Input id="fixed_price" type="number" value={fixedPrice} onChange={(e) => setFixedPrice(Number(e.target.value))} className="col-span-3" />
            </div>
            <Button onClick={handleBulkUpdateFixedPrice}>Set Fixed Price</Button>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="price_per_size">Price per Size</label>
              <Input id="price_per_size" type="number" value={pricePerSize} onChange={(e) => setPricePerSize(Number(e.target.value))} className="col-span-3" />
            </div>
            <Button onClick={handleBulkUpdatePriceBySize}>Set Price by Size</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showAuctionDialog} onOpenChange={setShowAuctionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Auctions</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="min_price">Minimum Price</label>
              <Input id="min_price" type="number" value={auctionMinPrice} onChange={(e) => setAuctionMinPrice(Number(e.target.value))} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="start_time">Start Time</label>
              <Input
                id="start_time"
                type="datetime-local"
                value={auctionStartTime}
                onChange={(e) => setAuctionStartTime(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="end_time">End Time</label>
              <Input id="end_time" type="datetime-local" value={auctionEndTime} onChange={(e) => setAuctionEndTime(e.target.value)} className="col-span-3" />
            </div>
            <Button onClick={handleBulkCreateAuctions}>Create Auctions</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LandList;
