"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuctionList from "./auction-list";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios-instance";

export default function AdminAuctions() {
  const [auctions, setAuctions] = useState([]);
  const fetchAuctions = async () => {
    try {
      const response = await axiosInstance.get("/admin/manage/auctions");
      setAuctions(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch auctions:", error);
      setAuctions([]);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Auctions</CardTitle>
      </CardHeader>
      <CardContent>
        <AuctionList auctions={auctions} onUpdate={fetchAuctions} />
      </CardContent>
    </Card>
  );
}