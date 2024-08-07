"use client";
import { useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useUserStore } from "@/store/player-store/useUserStore";
import LandGrid from "./land-grid";
import PaginationControls from "./pagination-controls";
import FilterControls from "./filter-control";
import useDialogStore from "@/store/gui-store/useDialogStore";
import useMarketLandStore from "@/store/market-store/useMarketLandStore";
import BuildingSellDialog from "@/components/game-interface/dialogs/building-dialogs/building-sell-dialog";
import BuildingOfferListDialog from "@/components/game-interface/dialogs/building-dialogs/building-offer-list-dialog";
import BuildingUpdateSellDialog from "@/components/game-interface/dialogs/building-dialogs/building-update-sell-dialog";
import BuildingOfferDialog from "@/components/game-interface/dialogs/building-dialogs/building-offer-dialog";
import BuildingBuyDialog from "@/components/game-interface/dialogs/building-dialogs/building-buy-dialog";
import BuildingAuctionDialog from "@/components/game-interface/dialogs/building-dialogs/building-auction-dialog";
import BuildingAuctionBidDialog from "@/components/game-interface/dialogs/building-dialogs/building-auction-bid-dialog";

export default function MarketplacePage() {
  const user = useUserStore((state) => state.user);
  const { setDialogState } = useDialogStore();
  const { toast } = useToast();
  const {
    lands,
    currentPage,
    totalPages,
    sortBy,
    sortOrder,
    search,
    loading,
    activeTab,
    showOnlyForSale,
    marketFetchLands,
    marketHandlePageChange,
    marketHandleSort,
    marketHandleSearch,
    marketHandleForSaleFilter,
    marketHandleTabChange,
  } = useMarketLandStore();

  useEffect(() => {
    if (user) {
      marketFetchLands(user).catch((error) => {
        console.error("Failed to fetch lands:", error);
        toast({ title: "Error", description: "Failed to fetch lands. Please try again.", variant: "destructive" });
      });
    }
  }, [user, marketFetchLands, toast]);

  if (!user) return <div className="container mx-auto p-8 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl mb-2">Land Marketplace</h1>
      <p className="text-gray-600 mb-8">Explore, collect, and trade unique digital assets</p>
      <Tabs value={activeTab} onValueChange={marketHandleTabChange} className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Lands</TabsTrigger>
          <TabsTrigger value="user">My Lands</TabsTrigger>
        </TabsList>
      </Tabs>
      <FilterControls
        search={search}
        onSearch={marketHandleSearch}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={marketHandleSort}
        showOnlyForSale={showOnlyForSale}
        onForSaleFilter={marketHandleForSaleFilter}
      />
      <LandGrid lands={lands} loading={loading} activeTab={activeTab} user={user} setDialogState={setDialogState as any} />
      <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={marketHandlePageChange} />
      <BuildingSellDialog />
      <BuildingOfferListDialog />
      <BuildingUpdateSellDialog />
      <BuildingOfferDialog />
      <BuildingBuyDialog />
      <BuildingAuctionDialog />
      <BuildingAuctionBidDialog />
    </div>
  );
}
