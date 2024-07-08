import React, { useState, useEffect, useMemo } from "react";
import useDrawerStore from "@/store/gui-store/useDrawerStore";
import { XCircle, Search, DollarSign, MapPin, Trash2 } from "lucide-react";
import { Title } from "@/components/ui/tags";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { fetchUserOffers, deleteOffer } from "@/lib/api/offer";
import useMapStore from "@/store/engine-store/useMapStore";
import { useToast } from "@/components/ui/use-toast";
import { LngLatBounds } from "mapbox-gl";
import { Skeleton } from "@/components/ui/skeleton";
interface Offer {
  id: number;
  land_id: number;
  price: number;
  created_at: string;
  is_accepted: boolean;
}

export default function MyOffersDrawer() {
  const { myOffersDrawer, setDrawerState } = useDrawerStore();
  const { mapbox } = useMapStore();
  const { toast } = useToast();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (myOffersDrawer) {
      fetchOffers();
    }
  }, [myOffersDrawer]);

  const fetchOffers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchUserOffers();
      setOffers(data);
    } catch (err) {
      console.error("Error fetching offers:", err);
      setError("Failed to load offers. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setDrawerState("myOffersDrawer", false);
  };

  const handleFlyToLand = (landId: number) => {
    if (mapbox) {
      const source = mapbox.getSource("citylands") as mapboxgl.GeoJSONSource;
      if (source) {
        const features = (source as any)._data.features;
        const feature = features.find((f: { properties: { id: number } }) => f.properties.id === landId);
        if (feature) {
          const bounds = new LngLatBounds();
          if (feature.geometry.type === "Polygon") {
            feature.geometry.coordinates[0].forEach((coord: [number, number]) => {
              bounds.extend(coord);
            });
          } else if (feature.geometry.type === "MultiPolygon") {
            feature.geometry.coordinates.forEach((polygon: [number, number][][]) => {
              polygon[0].forEach((coord: [number, number]) => {
                bounds.extend(coord);
              });
            });
          }
          const center = bounds.getCenter();
          mapbox.flyTo({
            center: center,
            zoom: 20,
            duration: 2000,
          });
        }
      }
    }
  };

  const handleRemoveOffer = async (offerId: number) => {
    try {
      await deleteOffer(offerId);
      toast({
        title: "Offer removed",
        description: "Your offer has been successfully removed.",
      });
      fetchOffers(); // Refresh the offers list
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
    return offers
      .filter((offer) => offer.land_id.toString().toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((offer) => {
        if (statusFilter === "all") return true;
        if (statusFilter === "accepted") return offer.is_accepted;
        if (statusFilter === "pending") return !offer.is_accepted;
        return true;
      });
  }, [offers, searchTerm, statusFilter]);

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
          <Title className="text-teal font-semibold">My Offers</Title>
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
          ) : filteredOffers.length === 0 ? (
            <p>No offers found.</p>
          ) : (
            filteredOffers.map((offer: Offer) => (
              <Card key={offer.id} className="hover:bg-white/10">
                <CardContent className="p-3">
                  <div className="flex items-center">
                    <div className="w-16 h-16 mr-3 relative">
                      <img
                        src="https://cdn.leonardo.ai/users/4073c2a5-0f7a-4cac-8fc5-fa427e42d881/generations/2c5a4a78-1d25-4fa6-8da7-a2696e234167/Default_empty_land_green_3d_render_game_style_0.jpg" 
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
                        <Button size="sm" variant="outline" onClick={() => handleFlyToLand(offer.land_id)} className="p-1">
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
