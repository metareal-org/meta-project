import React, { useEffect, useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminAuctionStore } from "@/store/admin-store/useAdminAuctionStore";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Auction {
  id: number;
  land_id: number;
  minimum_price: number;
  start_time: string;
  end_time: string;
  status: string;
}

interface Filters {
  landId: string;
  status: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  minPrice: string;
  maxPrice: string;
}

interface SortConfig {
  key: keyof Auction | null;
  direction: "ascending" | "descending";
}

const AuctionList: React.FC = () => {
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    landId: "",
    status: "",
    startDate: undefined,
    endDate: undefined,
    minPrice: "",
    maxPrice: "",
  });
  const { selectedAuctions, adminSelectAuction, adminBulkCancelAuctions, adminBulkRemoveAuctions, auctions, adminFetchAuctions } = useAdminAuctionStore();
  const [filteredAuctions, setFilteredAuctions] = useState<Auction[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: "ascending" });

  useEffect(() => {
    adminFetchAuctions();
  }, [adminFetchAuctions]);

  useEffect(() => {
    applyFilters();
  }, [auctions, filters]);

  const applyFilters = () => {
    let result = auctions;

    if (filters.landId) {
      result = result.filter((auction) => auction.land_id.toString().includes(filters.landId));
    }
    if (filters.status) {
      result = result.filter((auction) => auction.status === filters.status);
    }
    if (filters.startDate) {
      result = result.filter((auction) => new Date(auction.start_time) >= filters.startDate!);
    }
    if (filters.endDate) {
      result = result.filter((auction) => new Date(auction.end_time) <= filters.endDate!);
    }
    if (filters.minPrice) {
      result = result.filter((auction) => auction.minimum_price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter((auction) => auction.minimum_price <= parseFloat(filters.maxPrice));
    }

    setFilteredAuctions(result);
  };

  const handleBulkCancelAuctions = () => {
    adminBulkCancelAuctions(() => {
      setShowCancelDialog(false);
      adminFetchAuctions();
    });
  };

  const handleBulkRemoveAuctions = () => {
    adminBulkRemoveAuctions(() => {
      setShowRemoveDialog(false);
      adminFetchAuctions();
    });
  };

  const handleSort = (key: keyof Auction) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedAuctions = useMemo(() => {
    let sortableItems = [...filteredAuctions];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredAuctions, sortConfig]);

  return (
    <>
      <div className="mb-4 space-y-4">
        <div className="flex space-x-2">
          <Input placeholder="Land ID" value={filters.landId} onChange={(e) => setFilters({ ...filters, landId: e.target.value })} />
          <Select onValueChange={(value) => setFilters({ ...filters, status: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className={cn("w-[200px] justify-start text-left font-normal", !filters.startDate && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.startDate ? format(filters.startDate, "PPP") : <span>Start Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={filters.startDate} onSelect={(date:any) => setFilters({ ...filters, startDate: date || undefined })} initialFocus />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className={cn("w-[200px] justify-start text-left font-normal", !filters.endDate && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.endDate ? format(filters.endDate, "PPP") : <span>End Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={filters.endDate} onSelect={(date:any) => setFilters({ ...filters, endDate: date || undefined })} initialFocus />
            </PopoverContent>
          </Popover>
          <Input placeholder="Min Price" type="number" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
          <Input placeholder="Max Price" type="number" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setShowCancelDialog(true)} disabled={selectedAuctions.length === 0}>
            Cancel Selected ({selectedAuctions.length})
          </Button>
          <Button onClick={() => setShowRemoveDialog(true)} disabled={selectedAuctions.length === 0} variant="destructive">
            Remove Selected ({selectedAuctions.length})
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Select</TableHead>
            <TableHead onClick={() => handleSort("id")}>ID</TableHead>
            <TableHead onClick={() => handleSort("land_id")}>Land ID</TableHead>
            <TableHead onClick={() => handleSort("minimum_price")}>Minimum Price</TableHead>
            <TableHead onClick={() => handleSort("start_time")}>Start Time</TableHead>
            <TableHead onClick={() => handleSort("end_time")}>End Time</TableHead>
            <TableHead onClick={() => handleSort("status")}>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAuctions.map((auction) => (
            <TableRow key={auction.id}>
              <TableCell>
                <Checkbox checked={selectedAuctions.includes(auction.id)} onCheckedChange={() => adminSelectAuction(auction.id)} />
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
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Cancel
            </Button>
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
            <Button variant="outline" onClick={() => setShowRemoveDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkRemoveAuctions}>
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuctionList;
