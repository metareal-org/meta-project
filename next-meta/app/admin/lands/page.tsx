"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LandList from "./land-list";
import { useEffect } from "react";
import useAdminLandsStore from "@/store/admin-store/useAdminLandsStore";

export default function AdminLands() {
  const { 
    adminFetchPageLands: fetchLands, 
    adminFetchAllLandIds: fetchAllLandIds
  } = useAdminLandsStore();

  useEffect(() => {
    fetchLands();
    fetchAllLandIds();
  }, [fetchLands, fetchAllLandIds]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-4xl font-normal">Manage Lands</CardTitle>
      </CardHeader>
      <CardContent>
        <LandList />
      </CardContent>
    </Card>
  );
}