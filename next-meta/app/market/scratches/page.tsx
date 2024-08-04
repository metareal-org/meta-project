"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios-instance";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ScratchBox {
  id: number;
  name: string;
  price: number;
  status: string;
}

export default function ScratchesPage() {
  const [availableScratchBoxes, setAvailableScratchBoxes] = useState<ScratchBox[]>([]);
  const [ownedScratchBoxes, setOwnedScratchBoxes] = useState<ScratchBox[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchScratchBoxes();
  }, []);

  const fetchScratchBoxes = async () => {
    try {
      setLoading(true);
      const [availableResponse, ownedResponse] = await Promise.all([
        axiosInstance.get("/scratch-boxes/available"),
        axiosInstance.get("/scratch-boxes/owned"),
      ]);
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
      fetchScratchBoxes(); // Refresh the lists
    } catch (err) {
      setError("Failed to buy scratch box");
    }
  };

  const openScratchBox = async (id: number) => {
    try {
      const response = await axiosInstance.post(`/scratch-boxes/${id}/open`);
      alert(`You've received ${response.data.lands.length} land(s)!`);
      fetchScratchBoxes(); // Refresh the lists
    } catch (err) {
      setError("Failed to open scratch box");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Scratch Boxes</h1>
      <Tabs defaultValue="buy">
        <TabsList>
          <TabsTrigger value="buy">Buy Scratch Boxes</TabsTrigger>
          <TabsTrigger value="owned">My Scratch Boxes</TabsTrigger>
        </TabsList>
        <TabsContent value="buy">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableScratchBoxes.map((box) => (
              <Card key={box.id}>
                <CardHeader>
                  <CardTitle>{box.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Price: {box.price} BNB</p>
                  <Button onClick={() => buyScratchBox(box.id)}>Buy</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="owned">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ownedScratchBoxes.map((box) => (
              <Card key={box.id}>
                <CardHeader>
                  <CardTitle>{box.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Status: {box.status}</p>
                  {box.status === 'sold' && (
                    <Button onClick={() => openScratchBox(box.id)}>Open</Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}