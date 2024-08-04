"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ScratchBoxList from "./scratch-box-list";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios-instance";

export default function AdminScratchBoxes() {
  const [scratchBoxes, setScratchBoxes] = useState([]);
  const fetchScratchBoxes = async () => {
    try {
      const response = await axiosInstance.get("/admin/scratch-boxes");
      setScratchBoxes(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch scratch boxes:", error);
      setScratchBoxes([]);
    }
  };

  useEffect(() => {
    fetchScratchBoxes();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Scratch Boxes</CardTitle>
      </CardHeader>
      <CardContent>
        <ScratchBoxList scratchBoxes={scratchBoxes} onUpdate={fetchScratchBoxes} />
      </CardContent>
    </Card>
  );
}