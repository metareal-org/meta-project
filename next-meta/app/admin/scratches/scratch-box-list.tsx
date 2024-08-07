import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import useAdminLandsStore from "@/store/admin-store/useAdminLandsStore";
import useAdminScratchBoxStore from "@/store/admin-store/useAdminScratchBoxStore";

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

const ScratchBoxList: React.FC = () => {
  const [selectedLands, setSelectedLands] = useState<number[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newScratchBoxName, setNewScratchBoxName] = useState("");
  const [randomSelectCount, setRandomSelectCount] = useState(0);
  const [sortBy, setSortBy] = useState<"id" | "name" | "price">("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const {
    adminFetchPageAvailableLandsForScratchBox,
    adminPageAvailableLandsForScratchBox,
    currentPage,
    totalPages,
    adminCreateScratchBox,
    adminFetchScratchBoxes,
    adminScratchBoxes,
    adminDeleteScratchBox,
    adminSelectAllPages,
  } = useAdminScratchBoxStore();
  const { toast } = useToast();

  useEffect(() => {
    adminFetchScratchBoxes();
  }, []);

  useEffect(() => {
    if (showCreateDialog) {
      adminFetchPageAvailableLandsForScratchBox();
    }
  }, [showCreateDialog]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLands((prevSelected) => {
        const newSelected = new Set(prevSelected);
        adminPageAvailableLandsForScratchBox.forEach((land) => newSelected.add(land.id));
        return Array.from(newSelected);
      });
    } else {
      setSelectedLands((prevSelected) => prevSelected.filter((id) => !adminPageAvailableLandsForScratchBox.some((land) => land.id === id)));
    }
  };

  const handleSelectLand = (id: number) => {
    setSelectedLands((prev) => (prev.includes(id) ? prev.filter((landId) => landId !== id) : [...prev, id]));
  };

  const handleCreateScratchBox = async () => {
    try {
      await adminCreateScratchBox(newScratchBoxName, selectedLands);
      setShowCreateDialog(false);
      setSelectedLands([]);
      setNewScratchBoxName("");
      adminFetchScratchBoxes(); // Refresh the list after creating
    } catch (error) {
      console.error("Error creating scratch box:", error);
      toast({
        title: "Error",
        description: "Failed to create scratch box. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteScratchBox = async (id: number) => {
    try {
      await adminDeleteScratchBox(id);
      adminFetchScratchBoxes(); // Refresh the list after deleting
    } catch (error) {
      console.error("Error deleting scratch box:", error);
      toast({
        title: "Error",
        description: "Failed to delete scratch box. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRandomSelect = () => {
    const shuffled = adminPageAvailableLandsForScratchBox.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, randomSelectCount).map((land) => land.id);
    setSelectedLands(selected);
  };

  const handleSelectAllPages = async () => {
    try {
      const allLandIds = await adminSelectAllPages();
      setSelectedLands(allLandIds);
    } catch (error) {
      console.error("Error selecting all lands:", error);
      toast({
        title: "Error",
        description: "Failed to select all lands. Please try again.",
        variant: "destructive",
      });
    }
  };

  const calculateTotalPrice = () => {
    return selectedLands.reduce((total, landId) => {
      const land = adminPageAvailableLandsForScratchBox.find((l) => l.id === landId);
      return total + (land?.fixed_price || 0);
    }, 0);
  };

  const calculateTotalSize = () => {
    return selectedLands.reduce((total, landId) => {
      const land = adminPageAvailableLandsForScratchBox.find((l) => l.id === landId);
      return total + (land?.size || 0);
    }, 0);
  };

  const sortedScratchBoxes = adminScratchBoxes
    ? [...adminScratchBoxes].sort((a, b) => {
        if (sortOrder === "asc") {
          return a[sortBy] > b[sortBy] ? 1 : -1;
        } else {
          return a[sortBy] < b[sortBy] ? 1 : -1;
        }
      })
    : [];
  const filteredScratchBoxes = sortedScratchBoxes.filter(
    (box) => box.name.toLowerCase().includes(searchTerm.toLowerCase()) || box.id.toString().includes(searchTerm)
  );

  useEffect(() => {
    if (showCreateDialog) {
      console.log("Fetching available lands...");
      adminFetchPageAvailableLandsForScratchBox();
    }
  }, [showCreateDialog]);


  
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
                        checked={adminPageAvailableLandsForScratchBox.every((land) => selectedLands.includes(land.id))}
                        onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                      />
                    </TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Fixed Price</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Owner</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminPageAvailableLandsForScratchBox.map((land) => (
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
                  <Button variant={"secondary"} className="mr-2" onClick={handleSelectAllPages}>
                    Select All Lands
                  </Button>
                  <Button onClick={() => adminFetchPageAvailableLandsForScratchBox(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                  </Button>
                  <Button onClick={() => adminFetchPageAvailableLandsForScratchBox(currentPage + 1)} disabled={currentPage === totalPages} className="ml-2">
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
