"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios-instance";
import { useToast } from "@/components/ui/use-toast";
import { useUserStore } from "@/store/player-store/useUserStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ScratchBoxTable } from "./scratchtbox-table";
import { OpenScratchBoxDialog } from "./open-scratchtbox-dialog";
import { WonLandsDialog } from "./won-lands-dialog";
import { ScratchBoxFilters } from "./scratch-box-filters";
import { ScratchBox } from "./types";
import { LandWithDetails } from "@/store/world-store/useLandStore";

export default function ScratchesPage() {
  const { user } = useUserStore();
  const [availableScratchBoxes, setAvailableScratchBoxes] = useState<ScratchBox[]>([]);
  const [ownedScratchBoxes, setOwnedScratchBoxes] = useState<ScratchBox[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bnbBalance, setBnbBalance] = useState<number>(0);
  const [selectedBox, setSelectedBox] = useState<ScratchBox | null>(null);
  const [openLandsDialog, setOpenLandsDialog] = useState(false);
  const [wonLands, setWonLands] = useState<LandWithDetails[]>([]);
  const [filter, setFilter] = useState("all");
  const { toast } = useToast();
  const filteredAvailableBoxes = availableScratchBoxes.filter((box) => filter === "all" || box.status === filter);
  const filteredOwnedBoxes = ownedScratchBoxes.filter((box) => filter === "all" || box.status === filter);

  useEffect(() => {
    if (!user) return;
    setBnbBalance(user?.assets.find((a) => a.type === "bnb")?.amount || 0);
  }, [user]);

  useEffect(() => {
    fetchScratchBoxes();
  }, []);

  const fetchScratchBoxes = async () => {
    try {
      setLoading(true);
      const [availableResponse, ownedResponse] = await Promise.all([axiosInstance.get("/scratch-boxes/available"), axiosInstance.get("/scratch-boxes/owned")]);
      setAvailableScratchBoxes(availableResponse.data);
      setOwnedScratchBoxes(ownedResponse.data);
    } catch (err) {
      setError("Failed to fetch scratch boxes");
    } finally {
      setLoading(false);
    }
  };

  const buyScratchBox = async (id: number) => {
    try {
      await axiosInstance.post(`/scratch-boxes/${id}/buy`);
      fetchScratchBoxes();
      toast({
        title: "Success",
        description: "Scratch box purchased successfully!",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to buy scratch box",
        variant: "destructive",
      });
    }
  };

  const openScratchBox = async (id: number) => {
    try {
      const response = await axiosInstance.post<{ lands: LandWithDetails[] }>(`/scratch-boxes/${id}/open`);
      setSelectedBox(null);
      fetchScratchBoxes();
      setWonLands(response.data.lands);
      setOpenLandsDialog(true);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to open scratch box",
        variant: "destructive",
      });
    }
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
          <ScratchBoxTable scratchBoxes={filteredAvailableBoxes} bnbBalance={bnbBalance} onBuy={buyScratchBox} mode="buy" />
        </TabsContent>

        <TabsContent value="owned">
          <ScratchBoxTable scratchBoxes={filteredOwnedBoxes} onOpen={setSelectedBox} mode="owned" />
        </TabsContent>
      </Tabs>

      <OpenScratchBoxDialog selectedBox={selectedBox} onClose={() => setSelectedBox(null)} onConfirm={openScratchBox} />
      <WonLandsDialog open={openLandsDialog} onOpenChange={setOpenLandsDialog} wonLands={wonLands} />
    </div>
  );
}
