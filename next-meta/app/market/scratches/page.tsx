"use client";
import React, { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useUserStore } from "@/store/player-store/useUserStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ScratchBoxTable } from "./scratchtbox-table";
import { OpenScratchBoxDialog } from "./open-scratchtbox-dialog";
import { WonLandsDialog } from "./won-lands-dialog";
import { ScratchBoxFilters } from "./scratch-box-filters";
import { useMarketScratcheStore } from "@/store/market-store/useMarketScratcheStore";

export default function ScratchesPage() {
  const { user } = useUserStore();
  const {
    availableScratchBoxes,
    ownedScratchBoxes,
    loading,
    error,
    wonLands,
    filter,
    setFilter,
    marketFetchScratchBoxes,
    marketBuyScratchBox,
    marketOpenScratchBox
  } = useMarketScratcheStore();

  const [selectedBox, setSelectedBox] = React.useState(null);
  const [openLandsDialog, setOpenLandsDialog] = React.useState(false);
  const { toast } = useToast();

  const bnbBalance = user?.assets.find((a) => a.type === "bnb")?.amount || 0;

  const filteredAvailableBoxes = availableScratchBoxes.filter((box) => filter === "all" || box.status === filter);
  const filteredOwnedBoxes = ownedScratchBoxes.filter((box) => filter === "all" || box.status === filter);

  useEffect(() => {
    marketFetchScratchBoxes();
  }, []);

  const handleBuyScratchBox = async (id: number) => {
    await marketBuyScratchBox(id);
    toast({
      title: "Success",
      description: "Scratch box purchased successfully!",
    });
  };

  const handleOpenScratchBox = async (id: number) => {
    await marketOpenScratchBox(id);
    setSelectedBox(null);
    setOpenLandsDialog(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl mb-2">Scratch Boxes</h1>
        <p className="text-gray-600 mb-8">Explore, collect, and trade unique digital assets</p>
        <div>
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle className="text-lg font-semibold">Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl mb-2">Scratch Boxes</h1>
      <p className="text-gray-600 mb-8">Explore, collect, and trade unique digital assets</p>

      <Tabs defaultValue="buy" className="space-y-4">
        <TabsList className="mb-8">
          <TabsTrigger value="buy">Buy Scratch Boxes</TabsTrigger>
          <TabsTrigger value="owned">My Scratch Boxes</TabsTrigger>
        </TabsList>

        <ScratchBoxFilters onFilterChange={setFilter} />

        <TabsContent value="buy">
          <ScratchBoxTable scratchBoxes={filteredAvailableBoxes} bnbBalance={bnbBalance} onBuy={handleBuyScratchBox} mode="buy" />
        </TabsContent>

        <TabsContent value="owned">
          <ScratchBoxTable scratchBoxes={filteredOwnedBoxes} onOpen={setSelectedBox} mode="owned" />
        </TabsContent>
      </Tabs>

      <OpenScratchBoxDialog selectedBox={selectedBox} onClose={() => setSelectedBox(null)} onConfirm={handleOpenScratchBox} />
      <WonLandsDialog open={openLandsDialog} onOpenChange={setOpenLandsDialog} wonLands={wonLands} />
    </div>
  );
}
