// app/market/assets/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useUserStore } from "@/store/player-store/useUserStore";
import { useToast } from "@/components/ui/use-toast";
import AssetGrid from "./asset-grid";
import FilterControls from "./filter-control";
import useAssetStore from "@/store/player-store/useAssetStore";
import useAlertStore from "@/store/gui-store/useAlertStore";
import useSpinwheelStore from "@/store/minigame-store/useSpinwheelStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SellModal } from "./sell-modal";
import axiosInstance from "@/lib/axios-instance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssetListingsGrid } from "./asset-listing-grid";
import { AssetListing } from "./types";
export default function AssetsPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("type");
  const [sortOrder, setSortOrder] = useState("asc");
  const { user } = useUserStore();
  const [listings, setListings] = useState<AssetListing[]>([]);
  const [ownListings, setOwnListings] = useState<AssetListing[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { assets } = useAssetStore();
  const { openAlert } = useAlertStore();
  const { setShowSpinModal } = useSpinwheelStore();
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [selectedAssetForSell, setSelectedAssetForSell] = useState<string | null>(null);

  useEffect(() => {
    if (user) setLoading(false);
  }, [user]);

  const handleSort = (newSortBy: string) => {
    setSortOrder(newSortBy === sortBy ? (sortOrder === "asc" ? "desc" : "asc") : "asc");
    setSortBy(newSortBy);
  };

  const handleSearch = (value: string) => setSearch(value);

  const handleItemClick = (type: string, amount: number) => {
    if (amount === 0) return;
    if (type === "ticket") showReadyToPlayAlert();
    else if (type === "giftbox") console.log("Giftbox clicked");
  };

  const showReadyToPlayAlert = () => {
    openAlert({
      title: "Are you ready to play the game?",
      picture: "/assets/images/missions/get-your-airdrops/read-to-spin.jfif",
      description: "Get ready for an exciting spin!",
      buttons: [{ label: "Let's go!", onClick: () => setShowSpinModal(true) }],
    });
  };

  const handleSellClick = (assetType: string) => {
    setSelectedAssetForSell(assetType);
    setSellModalOpen(true);
  };

  const handleCreateListing = async (data: { asset_type: string; amount: number; price_in_bnb: number }) => {
    try {
      const response = await axiosInstance.post("/asset-listings", data);
      if (response.data && response.data.listing) {
        toast({ title: "Success", description: "Listing created successfully!" });
        setSellModalOpen(false);
      } else throw new Error("Unexpected response format");
    } catch (error: any) {
      console.error("Error creating listing:", error);
      let errorMessage = "Failed to create listing";
      if (error.response && error.response.data && error.response.data.message) errorMessage = error.response.data.message;
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/asset-listings");
      const allListings = response.data.listings;
      setListings(allListings.filter((listing: AssetListing) => listing.user_id !== user?.id));
      setOwnListings(allListings.filter((listing: AssetListing) => listing.user_id === user?.id));
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch asset listings", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (listingId: number) => {
    try {
      await axiosInstance.post(`/asset-listings/${listingId}/buy`);
      toast({ title: "Success", description: "Asset purchased successfully!" });
      fetchListings();
    } catch (error) {
      toast({ title: "Error", description: "Failed to purchase asset", variant: "destructive" });
    }
  };

  const handleRemove = async (listingId: number) => {
    try {
      await axiosInstance.delete(`/asset-listings/${listingId}`);
      toast({ title: "Success", description: "Listing removed successfully!" });
      fetchListings();
    } catch (error) {
      toast({ title: "Error", description: "Failed to remove listing", variant: "destructive" });
    }
  };

  if (!user) return <div className="container mx-auto p-8 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl mb-2">NFT Marketplace</h1>
      <p className="text-gray-600 mb-8">Explore, collect, and trade unique digital assets</p>
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="buy">Buy</TabsTrigger>
          <TabsTrigger value="my-listings">My Listing</TabsTrigger>
        </TabsList>
        <TabsContent value="inventory">
          <FilterControls search={search} onSearch={handleSearch} sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
          <AssetGrid assets={assets} loading={loading} search={search} sortBy={sortBy} sortOrder={sortOrder} onItemClick={handleItemClick} onSell={handleSellClick} />
        </TabsContent>
        <TabsContent value="buy">
          <Card className="mt-4">
            <CardHeader><CardTitle className="text-2xl">Available Assets</CardTitle></CardHeader>
            <CardContent><AssetListingsGrid listings={ownListings} onBuy={handleBuy} loading={loading} /></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="my-listings">
          <Card className="mt-4">
            <CardHeader><CardTitle className="text-2xl">My Listed Assets</CardTitle></CardHeader>
            <CardContent><AssetListingsGrid listings={listings} onRemove={handleRemove} loading={loading} isOwnListings /></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {selectedAssetForSell && (
        <SellModal
          isOpen={sellModalOpen}
          onClose={() => setSellModalOpen(false)}
          onSell={handleCreateListing}
          assetType={selectedAssetForSell}
          maxAmount={useAssetStore.getState().getAssetAmount(selectedAssetForSell as any)}
        />
      )}
    </div>
  );
}
