// app/admin/dashboard/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImportForm from "./import-form";
import VersionList from "./version-list";
import { useAdminLandVersionStore } from "@/store/admin-store/useAdminLandVersionStore";

export default function AdminDataset() {
  const { adminFetchLandVersions } = useAdminLandVersionStore();

  useEffect(() => {
    adminFetchLandVersions();
  }, [adminFetchLandVersions]);

  return (
    <div className="container mx-auto p-4">
      <ImportForm onImportSuccess={adminFetchLandVersions} />
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>GeoJSON Versions</CardTitle>
        </CardHeader>
        <CardContent>
          <VersionList />
        </CardContent>
      </Card>
    </div>
  );
}
