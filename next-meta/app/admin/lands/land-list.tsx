import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useAdminLandsStore from "@/store/admin-store/useAdminLandsStore";
import { LandWithDetails } from "@/store/world-store/useLandStore";

const LandList: React.FC = () => {
  const {
    pageLands,
    allLandIds,
    currentPage,
    totalPages,
    selectedLands,
    adminFetchPageLands,
    adminHandleSelectAll,
    adminHandleSelectLand,
    adminHandleBulkCreateAuctions,
    adminHandleBulkUpdateFixedPrice,
    adminHandleBulkUpdatePriceBySize,
    adminCalculateTotalPrice,
    adminCalculateTotalSize,
  } = useAdminLandsStore();

  const [fixedPrice, setFixedPrice] = useState<number>(0);
  const [pricePerSize, setPricePerSize] = useState<number>(0);
  const [showBulkEditDialog, setShowBulkEditDialog] = useState(false);
  const [showAuctionDialog, setShowAuctionDialog] = useState(false);
  const [auctionMinPrice, setAuctionMinPrice] = useState<number>(0);
  const [auctionStartTime, setAuctionStartTime] = useState<string>("");
  const [auctionEndTime, setAuctionEndTime] = useState<string>("");
  const [sortBy, setSortBy] = useState<keyof LandWithDetails>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterForSale, setFilterForSale] = useState<boolean | null>(null);
  const [selectedLandDetails, setSelectedLandDetails] = useState<LandWithDetails | null>(null);
  const [filterAuctionStatus, setFilterAuctionStatus] = useState<"all" | "active" | "inactive">("all");
  const [filterMinPrice, setFilterMinPrice] = useState<number | "">("");
  const [filterMaxPrice, setFilterMaxPrice] = useState<number | "">("");
  const [filterMinSize, setFilterMinSize] = useState<number | "">("");
  const [filterMaxSize, setFilterMaxSize] = useState<number | "">("");
  const filteredLands = pageLands.filter((land) => {
    const matchesSearch = land.id.toString().includes(searchTerm) || land.owner_nickname?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesForSale = filterForSale === null || land.is_for_sale === filterForSale;
    const matchesAuctionStatus =
      filterAuctionStatus === "all" ||
      (filterAuctionStatus === "active" && land.has_active_auction) ||
      (filterAuctionStatus === "inactive" && !land.has_active_auction);
    const matchesPrice = (filterMinPrice === "" || land.fixed_price >= filterMinPrice) && (filterMaxPrice === "" || land.fixed_price <= filterMaxPrice);
    const matchesSize = (filterMinSize === "" || land.size >= filterMinSize) && (filterMaxSize === "" || land.size <= filterMaxSize);

    return matchesSearch && matchesForSale && matchesAuctionStatus && matchesPrice && matchesSize;
  });

  const sortedLands = [...filteredLands].sort((a: any, b: any) => {
    if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const handleShowDetails = (landId: number) => {
    const land = pageLands.find((l) => l.id === landId);
    setSelectedLandDetails(land || null);
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

        <Select value={sortBy} onValueChange={(value: keyof LandWithDetails) => setSortBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="id">ID</SelectItem>
            <SelectItem value="owner_nickname">Owner</SelectItem>
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
          <strong>Total Price:</strong> {adminCalculateTotalPrice()}
        </div>
        <div>
          <strong>Total Size:</strong> {adminCalculateTotalSize()}
        </div>
        <div>
          <strong>Avg Price per Size:</strong> {selectedLands.length ? (adminCalculateTotalPrice() / adminCalculateTotalSize()).toFixed(2) : 0}
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox checked={selectedLands.length === allLandIds.length} onCheckedChange={(checked) => adminHandleSelectAll(checked as boolean)} />
            </TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Fixed Price</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>For Sale</TableHead>
            <TableHead>Auction</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedLands.map((land) => (
            <TableRow key={land.id}>
              <TableCell>
                <Checkbox checked={selectedLands.includes(land.id)} onCheckedChange={() => adminHandleSelectLand(land.id)} />
              </TableCell>
              <TableCell>{land.id}</TableCell>
              <TableCell>{land.owner_nickname}</TableCell>
              <TableCell>{land.fixed_price}</TableCell>
              <TableCell>{land.size}</TableCell>
              <TableCell>{land.is_for_sale ? "Yes" : "No"}</TableCell>
              <TableCell>{land.has_active_auction ? "Yes" : "No"}</TableCell>
              <TableCell>
                <Button onClick={() => handleShowDetails(land.id)}>More</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <div>
          Page {currentPage} of {totalPages}
        </div>
        <div>
          <Button onClick={() => adminFetchPageLands(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </Button>
          <Button onClick={() => adminFetchPageLands(currentPage + 1)} disabled={currentPage === totalPages} className="ml-2">
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
            <Button onClick={() => adminHandleBulkUpdateFixedPrice(fixedPrice)}>Set Fixed Price</Button>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="price_per_size">Price per Size</label>
              <Input id="price_per_size" type="number" value={pricePerSize} onChange={(e) => setPricePerSize(Number(e.target.value))} className="col-span-3" />
            </div>
            <Button onClick={() => adminHandleBulkUpdatePriceBySize(pricePerSize)}>Set Price by Size</Button>
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
            <Button
              onClick={() => {
                adminHandleBulkCreateAuctions({ minimumPrice: auctionMinPrice, startTime: auctionStartTime, endTime: auctionEndTime }).then(() => {
                  setShowAuctionDialog(false);
                });
              }}
            >
              Create Auctions
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={!!selectedLandDetails} onOpenChange={() => setSelectedLandDetails(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Land Details</DialogTitle>
          </DialogHeader>
          {selectedLandDetails && (
            <div className="grid gap-4 py-4">
              <div>
                <strong>ID:</strong> {selectedLandDetails.id}
              </div>
              <div>
                <strong>Owner:</strong> {selectedLandDetails.owner_nickname}
              </div>
              <div>
                <strong>Fixed Price:</strong> {selectedLandDetails.fixed_price}
              </div>
              <div>
                <strong>Size:</strong> {selectedLandDetails.size}
              </div>
              <div>
                <strong>For Sale:</strong> {selectedLandDetails.is_for_sale ? "Yes" : "No"}
              </div>
              <div>
                <strong>Has Active Auction:</strong> {selectedLandDetails.has_active_auction ? "Yes" : "No"}
              </div>
              <div>
                <strong>Region:</strong> {selectedLandDetails.region}
              </div>
              <div>
                <strong>Zone:</strong> {selectedLandDetails.zone}
              </div>
              <div>
                <strong>Type:</strong> {selectedLandDetails.type}
              </div>
              {selectedLandDetails.active_auction && (
                <div>
                  <strong>Auction Details:</strong>
                  <div>Minimum Bid: {selectedLandDetails.active_auction.minimum_bid}</div>
                  <div>Start Time: {selectedLandDetails.active_auction.start_time}</div>
                  <div>End Time: {selectedLandDetails.active_auction.end_time}</div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LandList;
