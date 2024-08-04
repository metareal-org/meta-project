// app/admin/dashboard/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axiosInstance from "@/lib/axios-instance";
import ImportForm from "./import-form";
import VersionList from "./version-list";

export default function AdminDataset() {
  const [versions, setVersions] = useState([]);
  const [lands, setLands] = useState([]);

  const fetchVersions = async () => {
    try {
      const response = await axiosInstance.get("/admin/lands/versions");
      setVersions(response.data);
    } catch (error) {
      console.error("Failed to fetch versions:", error);
    }
  };
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
    fetchVersions();
    fetchLands();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <ImportForm onImportSuccess={fetchVersions} />
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>GeoJSON Versions</CardTitle>
        </CardHeader>
        <CardContent>
          <VersionList versions={versions} onUpdate={fetchVersions} />
        </CardContent>
      </Card>
    </div>
  );
}
