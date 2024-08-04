import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  allLandIds: number[];
  onUpdate: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const LandList: React.FC<LandListProps> = ({ lands, allLandIds, onUpdate, currentPage, totalPages, onPageChange }) => {
  const [selectedLands, setSelectedLands] = useState<number[]>([]);
  const [fixedPrice, setFixedPrice] = useState<number>(0);
  const [pricePerSize, setPricePerSize] = useState<number>(0);
  const [showBulkEditDialog, setShowBulkEditDialog] = useState(false);
  const [showAuctionDialog, setShowAuctionDialog] = useState(false);
  const [auctionMinPrice, setAuctionMinPrice] = useState<number>(0);
  const [auctionStartTime, setAuctionStartTime] = useState<string>("");
  const [auctionEndTime, setAuctionEndTime] = useState<string>("");
  const [sortBy, setSortBy] = useState<keyof Land>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterForSale, setFilterForSale] = useState<boolean | null>(null);

  
  const { toast } = useToast();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLands(allLandIds);
    } else {
      setSelectedLands([]);
    }
  };

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

  const filteredLands = lands.filter(
    (land) =>
      (land.id.toString().includes(searchTerm) || land.owner_nickname.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterForSale === null || land.is_for_sale === filterForSale)
  );

  const sortedLands = [...filteredLands].sort((a: any, b: any) => {
    if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const calculateTotalPrice = () => {
    return selectedLands.reduce((total, landId) => {
      const land = lands.find((l) => l.id === landId);
      return total + (land?.fixed_price || 0);
    }, 0);
  };

  const calculateTotalSize = () => {
    return selectedLands.reduce((total, landId) => {
      const land = lands.find((l) => l.id === landId);
      return total + (land?.size || 0);
    }, 0);
  };

  return (
    <>
      <div className="mb-4 space-x-2 flex items-center ">
        <Button onClick={() => setShowBulkEditDialog(true)} disabled={selectedLands.length === 0}>
          Edit Lands ({selectedLands.length})
        </Button>
        <Button onClick={() => setShowAuctionDialog(true)} disabled={selectedLands.length === 0}>
          Create Auctions ({selectedLands.length})
        </Button>

        <Select
          value={filterForSale === null ? "all" : filterForSale.toString()}
          onValueChange={(value) => setFilterForSale(value === "all" ? null : value === "true")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by sale status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">For Sale</SelectItem>
            <SelectItem value="false">Not For Sale</SelectItem>
          </SelectContent>
        </Select>

        <Input placeholder="Search lands..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" />

        <Select value={sortBy} onValueChange={(value: keyof Land) => setSortBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="id">ID</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="fixed_price">Price</SelectItem>
            <SelectItem value="size">Size</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>{sortOrder === "asc" ? "▲" : "▼"}</Button>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <strong>Selected Lands:</strong> {selectedLands.length}
        </div>
        <div>
          <strong>Total Price:</strong> {calculateTotalPrice()}
        </div>
        <div>
          <strong>Total Size:</strong> {calculateTotalSize()}
        </div>
        <div>
          <strong>Avg Price per Size:</strong> {selectedLands.length ? (calculateTotalPrice() / calculateTotalSize()).toFixed(2) : 0}
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox checked={selectedLands.length === allLandIds.length} onCheckedChange={(checked) => handleSelectAll(checked as boolean)} />
            </TableHead>
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
          {sortedLands.map((land) => (
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
      <div className="flex justify-between items-center mt-4">
        <div>
          Page {currentPage} of {totalPages}
        </div>
        <div>
          <Button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </Button>
          <Button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="ml-2">
            Next
          </Button>
        </div>
      </div>
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
