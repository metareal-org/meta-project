import React, { useState, useEffect, useMemo } from "react";
import useDrawerStore from "@/store/gui-store/useDrawerStore";
import useMapStore from "@/store/engine-store/useMapStore";
import useLandStore from "@/store/world-store/useLandStore";
import { XCircle, Search, DollarSign, MapPin, Trash2 } from "lucide-react";
import { Title } from "@/components/ui/tags";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlayerOffersStore } from "@/store/player-store/usePlayerOffersStore";

interface Offer {
  id: number;
  land_id: number;
  price: number;
  created_at: string;
  is_accepted: boolean;
  land: {
    coordinates: string;
    center_point?: string;
  };
}

export default function MyOffersDrawer() {
  const { myOffersDrawer, setDrawerState } = useDrawerStore();
  const { mapbox } = useMapStore();
  const { setSelectedLandId } = useLandStore();
  const { toast } = useToast();
  const { playerOffers, isLoading, error, fetchPlayerOffers, deleteOffer } = usePlayerOffersStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (myOffersDrawer) {
      fetchPlayerOffers();
    }
  }, [myOffersDrawer, fetchPlayerOffers]);

  const handleClose = () => {
    setDrawerState("myOffersDrawer", false);
  };

  const handleFlyToLand = (offer: Offer) => {
    if (mapbox && offer.land?.center_point) {
      try {
        const centerPoint = JSON.parse(offer.land.center_point);
        mapbox.flyTo({
          center: [centerPoint.longitude, centerPoint.latitude],
          zoom: 19,
          duration: 2000,
        });

        // Set the selected land and open the building drawer
        setSelectedLandId(offer.land_id);
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

  const handleRemoveOffer = async (offerId: number) => {
    try {
      deleteOffer(offerId);
      toast({
        variant: "success",
        title: "Offer removed",
        description: "Your offer has been successfully removed.",
      });
    } catch (error) {
      console.error("Error removing offer:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove offer. Please try again.",
      });
    }
  };

  const filteredOffers = useMemo(() => {
    return playerOffers
      ? playerOffers
          .filter((offer) => offer?.land_id?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
          .filter((offer) => {
            if (statusFilter === "all") return true;
            if (statusFilter === "accepted") return offer?.is_accepted;
            if (statusFilter === "pending") return !offer?.is_accepted;
            return true;
          })
      : null;
  }, [playerOffers, searchTerm, statusFilter]);

  const OfferSkeleton = () => (
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
            <div className="flex justify-end mt-2 space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!myOffersDrawer) return null;

  return (
    <div className="fixed bottom-20 z-10 bg-background min-h-[200px] right-20 my-auto w-full max-w-sm shadow-lg rounded-lg p-4 border border-border">
      <div className="relative h-[60vh] flex flex-col">
        <header className="flex pb-2 justify-between items-center">
          <Title className="text-teal ">My Offers</Title>
          <XCircle size={18} className="cursor-pointer" onClick={handleClose} />
        </header>

        <div className="mb-3 space-y-2">
          <div className="relative">
            <Input type="text" placeholder="Search by Land ID" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8" />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-grow overflow-y-auto space-y-3 pr-2">
          {isLoading ? (
            <>
              <OfferSkeleton />
              <OfferSkeleton />
              <OfferSkeleton />
            </>
          ) : error ? (
            <p className="text-red">{error}</p>
          ) : filteredOffers?.length === 0 ? (
            <div className="text-sm absolute bottom-0 ">No offers found.</div>
          ) : (
            filteredOffers?.map((offer: Offer) => (
              <Card key={offer.id} className="hover:bg-white/10">
                <CardContent className="p-3">
                  <div className="flex items-center">
                    <div className="w-16 h-16 mr-3 relative">
                      <img
                        src="/assets/images/buldings/building-empty.png"
                        alt="Offer"
                        className="w-full h-full object-cover rounded-md shadow-sm"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-primary flex items-center">Land ID: {offer.land_id}</h3>
                        <div className="flex items-center text-xs text-muted-foreground">{new Date(offer.created_at).toLocaleDateString()}</div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className={offer.is_accepted ? "text-lime" : "text-white"}>{offer.is_accepted ? "Accepted" : "Pending"}</span>
                        <div className="flex items-center text-white">
                          <DollarSign className="mr-1 h-3 w-3" />
                          <span>{offer.price} Meta</span>
                        </div>
                      </div>
                      <div className="flex justify-end mt-2 space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleFlyToLand(offer)} className="p-1">
                          <MapPin size={14} />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleRemoveOffer(offer.id)} className="p-1">
                          <Trash2 size={14} />
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
