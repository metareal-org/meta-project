import React, { useState, useMemo, useEffect } from "react";
import useDrawerStore from "@/store/gui-store/useDrawerStore";
import useMapStore from "@/store/engine-store/useMapStore";
import useLandStore from "@/store/world-store/useLandStore";
import { useUserStore } from "@/store/player-store/useUserStore";
import { DollarSign, Maximize2, Search, XCircle, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Title } from "@/components/ui/tags";
import { Button } from "@/components/ui/button";
import { fetchAllLands, fetchUserLands } from "@/lib/api/land";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Land {
  id: number;
  owner_id: number;
  is_for_sale: boolean;
  fixed_price: number;
  type: string;
  size: number;
  coordinates: string;
  center_point: string;
}

export default function MylandsDrawer() {
  const { mylandsDrawer, setDrawerState } = useDrawerStore();
  const { user } = useUserStore();
  const { mapbox } = useMapStore();
  const { setSelectedLandId } = useLandStore();
  const { toast } = useToast();
  const [lands, setLands] = useState<Land[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [saleFilter, setSaleFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (mylandsDrawer) {
      setIsLoading(true);
      // fetchUserLands().then((fetchedLands) => { main
      fetchAllLands().then((fetchedLands) => { //test
        console.log(fetchedLands);
        setLands(fetchedLands);
        setIsLoading(false);
      });
    }
  }, [mylandsDrawer]);

  const handleClose = () => {
    setDrawerState("mylandsDrawer", false);
  };

  const filteredLands = useMemo(() => {
    if (!user?.id) return [];
    return lands
      .filter((land: Land) => land.id.toString().toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((land: Land) => {
        if (saleFilter === "all") return true;
        if (saleFilter === "forSale") return land.is_for_sale;
        if (saleFilter === "notForSale") return !land.is_for_sale;
        return true;
      });
  }, [lands, user?.id, searchTerm, saleFilter]);

  const handleFlyToLand = (land: Land) => {
    if (mapbox && land.center_point) {
      try {
        const centerPoint = JSON.parse(land.center_point);
        mapbox.flyTo({
          center: [centerPoint.longitude, centerPoint.latitude],
          zoom: 19,
          duration: 2000,
        });
        
        setSelectedLandId(land.id);
        setDrawerState("buildingDrawer", true);
      } catch (error) {
        console.error("Error parsing center point:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fly to land location.",
        });
      }
    }
  };

  const LandSkeleton = () => (
    <Card className="hover:bg-white/10">
      <CardContent className="p-3">
        <div className="flex items-center">
          <Skeleton className="w-16 h-16 mr-3 rounded-md" />
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-end mt-2">
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!mylandsDrawer) return null;

  return (
    <div className="fixed bottom-20 z-10 bg-background min-h-[200px] right-20 my-auto w-full max-w-sm shadow-lg rounded-lg p-4 border border-border">
      <div className="relative h-[60vh] flex flex-col">
        <header className="flex pb-2 justify-between items-center">
          <Title className="text-teal ">My Lands</Title>
          <XCircle size={18} className="cursor-pointer" onClick={handleClose} />
        </header>

        <div className="mb-3 space-y-2">
          <div className="relative">
            <Input type="text" placeholder="Search by ID" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8" />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          </div>
          <Select value={saleFilter} onValueChange={setSaleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="forSale">For Sale</SelectItem>
              <SelectItem value="notForSale">Not For Sale</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-grow overflow-y-auto space-y-3 pr-2">
          {isLoading ? (
            <>
              <LandSkeleton />
              <LandSkeleton />
              <LandSkeleton />
            </>
          ) : filteredLands.length === 0 ? (
            <div className="text-sm absolute bottom-0">No lands found.</div>
          ) : (
            filteredLands.map((land: Land) => (
              <Card key={land.id} className="hover:bg-white/10">
                <CardContent className="p-3">
                  <div className="flex items-center">
                    <div className="w-16 h-16 mr-3 relative">
                      <img
                        src="/assets/images/buldings/building-empty.png"
                        alt="Land"
                        className="w-full h-full object-cover rounded-md shadow-sm"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-primary flex items-center">
                          {land.type.charAt(0).toUpperCase() + land.type.slice(1)} {land.id}
                        </h3>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Maximize2 className="mr-1 h-3 w-3" />
                          <span>
                            {land.size} M<sup>2</sup>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className={land.is_for_sale ? "text-secondary" : "text-white"}>{land.is_for_sale ? "For Sale" : "Not for Sale"}</span>
                        {land.is_for_sale ?  (
                          <div className="flex items-center text-yellow-400">
                            <DollarSign className="mr-1 h-3 w-3" />
                            <span>{land.fixed_price} Meta</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button size="sm" variant="outline" onClick={() => handleFlyToLand(land)} className="p-1">
                          <MapPin size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}