// app/admin/dashboard/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LandList from "./land-list";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios-instance";

export default function AdminLands() {
  const [lands, setLands] = useState([]);
  const fetchLands = async () => {
    try {
      const response = await axiosInstance.get("/admin/manage/lands");
      setLands(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch lands:", error);
      setLands([]);
    }
  };

  useEffect(() => {
    fetchLands();
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Lands</CardTitle>
      </CardHeader>
      <CardContent>
        <LandList lands={lands} onUpdate={fetchLands} />
      </CardContent>
    </Card>
  );
}
