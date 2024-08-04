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
  is_locked: boolean;
  is_in_scratch: boolean;
  size: number;
}

interface ScratchBox {
  id: number;
  name: string;
  price: number;
  status: string;
  lands: Land[];
}

interface ScratchBoxListProps {
  scratchBoxes: ScratchBox[];
  onUpdate: () => void;
}

const ScratchBoxList: React.FC<ScratchBoxListProps> = ({ scratchBoxes, onUpdate }) => {
  const [selectedLands, setSelectedLands] = useState<number[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newScratchBoxName, setNewScratchBoxName] = useState("");
  const [availableLands, setAvailableLands] = useState<Land[]>([]);
  const [randomSelectCount, setRandomSelectCount] = useState(0);
  const [sortBy, setSortBy] = useState<"id" | "name" | "price">("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [allLandIds, setAllLandIds] = useState<number[]>([]);

  const fetchAllLandIds = async () => {
    try {
      const response = await axiosInstance.get("/admin/scratch-boxes/all-available-land-ids");
      setAllLandIds(response.data);
    } catch (error) {
      console.error("Failed to fetch all land IDs:", error);
    }
  };

  useEffect(() => {
    if (showCreateDialog) {
      fetchAvailableLands();
      fetchAllLandIds();
    }
  }, [showCreateDialog]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLands((prevSelected) => {
        const newSelected = new Set(prevSelected);
        availableLands.forEach((land) => newSelected.add(land.id));
        return Array.from(newSelected);
      });
    } else {
      setSelectedLands((prevSelected) => prevSelected.filter((id) => !availableLands.some((land) => land.id === id)));
    }
  };

  const { toast } = useToast();

  const handleSelectLand = (id: number) => {
    setSelectedLands((prev) => (prev.includes(id) ? prev.filter((landId) => landId !== id) : [...prev, id]));
  };

  const handleCreateScratchBox = async () => {
    try {
      await axiosInstance.post("/admin/scratch-boxes", {
        name: newScratchBoxName,
        land_ids: selectedLands,
      });
      toast({
        title: "Success",
        description: "Scratch box created successfully",
      });
      setShowCreateDialog(false);
      setSelectedLands([]);
      setNewScratchBoxName("");
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create scratch box",
        variant: "destructive",
      });
    }
  };

  const handleDeleteScratchBox = async (id: number) => {
    try {
      await axiosInstance.delete(`/admin/scratch-boxes/${id}`);
      toast({
        title: "Success",
        description: "Scratch box deleted successfully",
      });
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete scratch box",
        variant: "destructive",
      });
    }
  };

  const fetchAvailableLands = async (page = 1) => {
    try {
      const response = await axiosInstance.get(`/admin/scratch-boxes/available-lands?page=${page}`);
      setAvailableLands(response.data.data);
      setCurrentPage(response.data.current_page);
      setTotalPages(response.data.last_page);
    } catch (error) {
      console.error("Failed to fetch available lands:", error);
      setAvailableLands([]);
    }
  };

  const handleRandomSelect = () => {
    const shuffled = availableLands.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, randomSelectCount).map((land) => land.id);
    setSelectedLands(selected);
  };
  const handleSelectAllPages = async () => {
    try {
      const response = await axiosInstance.get("/admin/scratch-boxes/all-available-land-ids");
      setSelectedLands(response.data);
    } catch (error) {
      console.error("Failed to fetch all land IDs:", error);
      toast({
        title: "Error",
        description: "Failed to select all lands",
        variant: "destructive",
      });
    }
  };

  const calculateTotalPrice = () => {
    return selectedLands.reduce((total, landId) => {
      const land = availableLands.find((l) => l.id === landId);
      return total + (land?.fixed_price || 0);
    }, 0);
  };
  
  const calculateTotalSize = () => {
    return selectedLands.reduce((total, landId) => {
      const land = availableLands.find((l) => l.id === landId);
      return total + (land?.size || 0);
    }, 0);
  };

  const sortedScratchBoxes = [...scratchBoxes].sort((a, b) => {
    if (sortOrder === "asc") {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    } else {
      return a[sortBy] < b[sortBy] ? 1 : -1;
    }
  });

  const filteredScratchBoxes = sortedScratchBoxes.filter(
    (box) => box.name.toLowerCase().includes(searchTerm.toLowerCase()) || box.id.toString().includes(searchTerm)
  );

  useEffect(() => {
    if (showCreateDialog) {
      fetchAvailableLands(currentPage);
      fetchAllLandIds();
    }
  }, [showCreateDialog, currentPage]);
  return (
    <>
      <div className="mb-4 space-x-2 flex items-center">
        <Button onClick={() => setShowCreateDialog(true)}>Create Scratch Box</Button>
        <Input placeholder="Search scratch boxes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" />
        <Select value={sortBy} onValueChange={(value: "id" | "name" | "price") => setSortBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="id">ID</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="price">Price</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>{sortOrder === "asc" ? "▲" : "▼"}</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Lands Count</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredScratchBoxes.map((scratchBox) => (
            <TableRow key={scratchBox.id}>
              <TableCell>{scratchBox.id}</TableCell>
              <TableCell>{scratchBox.name}</TableCell>
              <TableCell>{scratchBox.price}</TableCell>
              <TableCell>{scratchBox.status}</TableCell>
              <TableCell>{scratchBox.lands.length}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => handleDeleteScratchBox(scratchBox.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-screen-lg">
          <DialogHeader>
            <DialogTitle>Create Scratch Box</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="scratch_box_name">Name</label>
              <Input id="scratch_box_name" value={newScratchBoxName} onChange={(e) => setNewScratchBoxName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="random_select">Randomly select</label>
              <Input
                id="random_select"
                type="number"
                value={randomSelectCount}
                onChange={(e) => setRandomSelectCount(Number(e.target.value))}
                className="col-span-2"
              />
              <Button onClick={handleRandomSelect}>Select</Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
            <div className="max-h-[80dvh] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Checkbox
                        checked={availableLands.every((land) => selectedLands.includes(land.id))}
                        onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                      />
                    </TableHead>
                    <TableHead>Select</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Fixed Price</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Owner</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableLands.map((land) => (
                    <TableRow key={land.id}>
                      <TableCell>
                        <Checkbox checked={selectedLands.includes(land.id)} onCheckedChange={() => handleSelectLand(land.id)} />
                      </TableCell>
                      <TableCell>{land.id}</TableCell>
                      <TableCell>{land.name}</TableCell>
                      <TableCell>{land.fixed_price}</TableCell>
                      <TableCell>{land.size}</TableCell>
                      <TableCell>{land.owner_nickname}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between items-center mt-4">
                <div>
                  Page {currentPage} of {totalPages}
                </div>
                <div>
                  <Button variant={"secondary"} className="mr-2" onClick={handleSelectAllPages}>Select All Lands</Button>
                  <Button onClick={() => fetchAvailableLands(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                  </Button>
                  <Button onClick={() => fetchAvailableLands(currentPage + 1)} disabled={currentPage === totalPages} className="ml-2">
                    Next
                  </Button>
                </div>
              </div>
            </div>

            <Button onClick={handleCreateScratchBox}>Create Scratch Box</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ScratchBoxList;
