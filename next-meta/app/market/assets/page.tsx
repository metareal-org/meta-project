// app/market/assets/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useUserStore } from "@/store/player-store/useUserStore";
import AssetGrid from "./asset-grid";
import FilterControls from "./filter-control";
import useAssetStore from "@/store/player-store/useAssetStore";
import useAlertStore from "@/store/gui-store/useAlertStore";
import useSpinwheelStore from "@/store/minigame-store/useSpinwheelStore";
import useMarketAssetStore from "@/store/market-store/useMarketAssetStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SellModal } from "./sell-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssetListingsGrid } from "./asset-listing-grid";

export default function AssetsPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("type");
  const [sortOrder, setSortOrder] = useState("asc");
  const { user } = useUserStore();
  const { assets } = useAssetStore();
  const { openAlert } = useAlertStore();
  const { setShowSpinModal } = useSpinwheelStore();
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [selectedAssetForSell, setSelectedAssetForSell] = useState<string | null>(null);

  const { 
    listings, 
    ownListings, 
    loading, 
    marketCreateAssetListing,
    marketFetchListings, 
    marketBuyAsset, 
    marketRemoveListing 
  } = useMarketAssetStore();

  useEffect(() => {
    if (user) marketFetchListings();
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
    await marketCreateAssetListing(data);
    setSellModalOpen(false);
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
            <CardContent><AssetListingsGrid listings={listings} onBuy={marketBuyAsset} loading={loading} /></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="my-listings">
          <Card className="mt-4">
            <CardHeader><CardTitle className="text-2xl">My Listed Assets</CardTitle></CardHeader>
            <CardContent><AssetListingsGrid listings={ownListings} onRemove={marketRemoveListing} loading={loading} isOwnListings /></CardContent>
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
