"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuctionList from "./auction-list";
import { useEffect } from "react";
import { useAdminAuctionStore } from "@/store/admin-store/useAdminAuctionStore";

export default function AdminAuctions() {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Auctions</CardTitle>
      </CardHeader>
      <CardContent>
        <AuctionList  />
      </CardContent>
    </Card>
  );
}