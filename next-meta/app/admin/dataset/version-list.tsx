// app/admin/dataset/version-list.tsx

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, Unlock, Loader2, Eye } from "lucide-react";
import { useAdminLandVersionStore } from "@/store/admin-store/useAdminLandVersionStore";
import dynamic from "next/dynamic";

const LandMapPreview = dynamic(() => import("./land-map-preview"), { ssr: false });

const VersionList: React.FC = () => {
  const {
    versions,
    selectedVersions,
    adminFetchLandVersions,
    adminSelectAllVersions,
    adminSelectVersion,
    adminToggleVersionActive,
    adminDeleteSelectedVersions,
    adminToggleVersionLock,
    adminPreviewVersion,
    adminUpdateLandType,
  } = useAdminLandVersionStore();

  const [previewData, setPreviewData] = useState<any>(null);
  const [previewingVersionId, setPreviewingVersionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingVersionId, setUpdatingVersionId] = useState<number | null>(null);
  const [isDeletingVersion, setIsDeletingVersion] = useState<number | null>(null);
  const [isTogglingLock, setIsTogglingLock] = useState<number | null>(null);

  useEffect(() => {
    adminFetchLandVersions();
  }, [adminFetchLandVersions]);

  const handleToggleActive = async (id: number, currentState: boolean) => {
    setUpdatingVersionId(id);
    try {
      await adminToggleVersionActive(id, currentState);
    } finally {
      setUpdatingVersionId(null);
    }
  };

  const handleDeleteSelected = async () => {
    setIsDeletingVersion(-1);
    try {
      await adminDeleteSelectedVersions();
    } finally {
      setIsDeletingVersion(null);
    }
  };

  const handleToggleLock = async (id: number, currentLockState: boolean) => {
    setIsTogglingLock(id);
    try {
      await adminToggleVersionLock(id, currentLockState);
    } finally {
      setIsTogglingLock(null);
    }
  };

  const handlePreview = async (id: number) => {
    try {
      setIsLoading(true);
      setPreviewingVersionId(id);
      const data = await adminPreviewVersion(id);
      setPreviewData(data);
    } catch (error) {
      setPreviewingVersionId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClosePreview = () => {
    setPreviewingVersionId(null);
    setPreviewData(null);
  };

  const handleUpdateType = async (id: number, type: string) => {
    await adminUpdateLandType(id, type);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="select-all"
            checked={selectedVersions.length === versions.length}
            onCheckedChange={(checked) => adminSelectAllVersions(checked as boolean)}
          />
          <label htmlFor="select-all">Select All</label>
        </div>
        <Button onClick={handleDeleteSelected} variant="destructive" disabled={selectedVersions.length === 0 || isDeletingVersion !== null}>
          {isDeletingVersion !== null ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete Selected"}
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Select</TableHead>
            <TableHead>File Name</TableHead>
            <TableHead>Version Name</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {versions.map((version) => (
            <TableRow key={version.id}>
              <TableCell>
                <Checkbox checked={selectedVersions.includes(version.id)} onCheckedChange={() => adminSelectVersion(version.id)} />
              </TableCell>
              <TableCell>{version.file_name}</TableCell>
              <TableCell>{version.version_name}</TableCell>
              <TableCell>{new Date(version.created_at).toLocaleString()}</TableCell>
              <TableCell>
                <Select value={version.type} onValueChange={(value) => handleUpdateType(version.id, value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="mine">Mine</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {updatingVersionId === version.id ? (
                  <Loader2 className="h-4 w-4 animate-spin ml-2 inline" />
                ) : (
                  <Switch
                    checked={version.is_active}
                    onCheckedChange={() => handleToggleActive(version.id, version.is_active)}
                    disabled={updatingVersionId === version.id}
                  />
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button onClick={() => handlePreview(version.id)} disabled={isLoading && previewingVersionId === version.id} size="sm">
                    {isLoading && previewingVersionId === version.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={() => handleToggleLock(version.id, version.is_locked)}
                    variant={version.is_locked ? "destructive" : "default"}
                    disabled={isTogglingLock === version.id || !version.is_active}
                    size="sm"
                  >
                    {isTogglingLock === version.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : version.is_locked ? (
                      <Unlock className="h-4 w-4" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={previewingVersionId !== null} onOpenChange={(open) => !open && handleClosePreview()}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Land Preview</DialogTitle>
          </DialogHeader>
          {previewData && <LandMapPreview geoJsonData={previewData} />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VersionList;
