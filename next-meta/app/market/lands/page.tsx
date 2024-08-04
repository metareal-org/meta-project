"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios-instance";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useUserStore } from "@/store/player-store/useUserStore";
import LandGrid from "./land-grid";
import PaginationControls from "./pagination-controls";
import FilterControls from "./filter-control";
import { LandWithDetails } from "@/store/world-store/useLandStore";
import useDialogStore from "@/store/gui-store/useDialogStore";
import useUnitStore from "@/store/world-store/useUnitStore";
import BuildingSellDialog from "@/components/game-interface/dialogs/building-dialogs/building-sell-dialog";
import BuildingOfferListDialog from "@/components/game-interface/dialogs/building-dialogs/building-offer-list-dialog";
import BuildingUpdateSellDialog from "@/components/game-interface/dialogs/building-dialogs/building-update-sell-dialog";
import BuildingOfferDialog from "@/components/game-interface/dialogs/building-dialogs/building-offer-dialog";
import BuildingBuyDialog from "@/components/game-interface/dialogs/building-dialogs/building-buy-dialog";
import BuildingAuctionDialog from "@/components/game-interface/dialogs/building-dialogs/building-auction-dialog";
import BuildingAuctionBidDialog from "@/components/game-interface/dialogs/building-dialogs/building-auction-bid-dialog";

export interface PaginatedResponse {
  data: LandWithDetails[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export default function MarketplacePage() {
  const [lands, setLands] = useState<LandWithDetails[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("fixed_price");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [showOnlyForSale, setShowOnlyForSale] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const { user, fetchUser } = useUserStore();
  const { setDialogState } = useDialogStore();
  const { moveMarker, marker } = useUnitStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await fetchUser();
      } catch (error) {
        console.error("Authentication failed:", error);
        router.push("/");
      }
    };
    checkAuth();
  }, [fetchUser, router]);

  const fetchLands = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await axiosInstance.get<PaginatedResponse>("/marketplace/lands", {
        params: {
          page: currentPage,
          sort_by: sortBy,
          sort_order: sortOrder,
          search: search,
          for_sale: showOnlyForSale,
          user_lands_only: activeTab === "user",
        },
      });
      setLands(response.data.data);
      setCurrentPage(response.data.current_page);
      setTotalPages(response.data.last_page);
    } catch (error) {
      console.error("Failed to fetch lands:", error);
      toast({
        title: "Error",
        description: "Failed to fetch lands. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage, sortBy, sortOrder, search, showOnlyForSale, toast, user]);

  useEffect(() => {
    if (user) {
      fetchLands();
    }
  }, [fetchLands, user]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (newSortBy: string) => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleForSaleFilter = (value: boolean) => {
    setShowOnlyForSale(value);
    setCurrentPage(1);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
    setShowOnlyForSale(false);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl mb-6">Land Marketplace</h1>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Lands</TabsTrigger>
          <TabsTrigger value="user">My Lands</TabsTrigger>
        </TabsList>
      </Tabs>

      <FilterControls
        search={search}
        onSearch={handleSearch}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        showOnlyForSale={showOnlyForSale}
        onForSaleFilter={handleForSaleFilter}
      />

      <LandGrid 
        lands={lands} 
        loading={loading} 
        activeTab={activeTab}
        user={user}
        setDialogState={setDialogState as any}
      />

      <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

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