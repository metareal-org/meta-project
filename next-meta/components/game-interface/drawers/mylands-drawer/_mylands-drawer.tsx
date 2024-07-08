import React, { useState, useMemo, useContext } from "react";
import useDrawerStore from "@/store/gui-store/useDrawerStore";
import useLandStore, { Land } from "@/store/world-store/useLandStore";
import { useUserStore } from "@/store/player-store/useUserStore";
import { DollarSign, Maximize2, Search, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { LngLatBounds } from "mapbox-gl";
import useMapStore from "@/store/engine-store/useMapStore";
import { Title } from "@/components/ui/tags";

export default function MylandsDrawer() {
  const { mylandsDrawer, setDrawerState } = useDrawerStore();
  const { lands } = useLandStore();
  const { user } = useUserStore();
  const { mapbox } = useMapStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [saleFilter, setSaleFilter] = useState("all");

  const handleClose = () => {
    setDrawerState("mylandsDrawer", false);
  };

  const filteredLands = useMemo(() => {
    if (!user?.id) return [];
    return lands
      .filter((land: Land) => land.owner_id === user.id)
      .filter((land: Land) => land.id.toString().toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((land: Land) => {
        if (saleFilter === "all") return true;
        if (saleFilter === "forSale") return land.is_for_sale;
        if (saleFilter === "notForSale") return !land.is_for_sale;
        return true;
      });
  }, [lands, user?.id, searchTerm, saleFilter]);

  const handleCardClick = (land: Land) => {
    if (mapbox) {
      const source = mapbox.getSource("citylands") as mapboxgl.GeoJSONSource;
      if (source) {
        const features = (source as any)._data.features;
        const feature = features.find((f: { properties: { id: number } }) => f.properties.id === land.id);
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

  if (!mylandsDrawer) return null;

  return (
    <div className="fixed bottom-20 z-10 bg-background min-h-[200px] right-20 my-auto w-full max-w-sm shadow-lg rounded-lg p-4 border border-border">
      <div className="relative h-[60vh] flex flex-col">
        <header className="flex pb-2 justify-between items-center">
          <Title className="text-teal font-semibold">My Lands</Title>
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
          {filteredLands.map((land: Land) => (
            <Card className="hover:bg-white/10 cursor-pointer" key={land.id} onClick={() => handleCardClick(land)}>
              <CardContent className="p-3">
                <div className="flex items-center">
                  <div className="w-16 h-16 mr-3 relative">
                    <img
                      src="https://cdn.leonardo.ai/users/4073c2a5-0f7a-4cac-8fc5-fa427e42d881/generations/2c5a4a78-1d25-4fa6-8da7-a2696e234167/Default_empty_land_green_3d_render_game_style_0.jpg"
                      alt="Land"
                      className="w-full h-full object-cover rounded-md shadow-sm"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold text-primary flex items-center">
                        {land.type.charAt(0).toUpperCase() + land.type.slice(1)} {land.id}
                      </h3>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Maximize2 className="mr-1 h-3 w-3" />
                        <span>
                          480 M<sup>2</sup>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className={land.is_for_sale ? "text-green-400" : "text-destructive"}>{land.is_for_sale ? "For Sale" : "Not for Sale"}</span>
                      {land.is_for_sale && (
                        <div className="flex items-center text-yellow-400">
                          <DollarSign className="mr-1 h-3 w-3" />
                          <span>{land.fixed_price} Meta</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
