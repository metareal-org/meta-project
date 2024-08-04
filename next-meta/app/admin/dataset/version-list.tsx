"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import axiosInstance from "@/lib/axios-instance";
import { useToast } from "@/components/ui/use-toast";
import dynamic from "next/dynamic";
import { Lock, Unlock, Loader2, Eye } from "lucide-react";

const LandMapPreview = dynamic(() => import("./land-map-preview"), { ssr: false });

interface Version {
  id: number;
  file_name: string;
  version_name: string;
  is_active: boolean;
  is_locked: boolean;
  created_at: string;
}

interface VersionListProps {
  versions: Version[];
  onUpdate: () => Promise<void>;
}

const VersionList: React.FC<VersionListProps> = ({ versions, onUpdate }) => {
  const [selectedVersions, setSelectedVersions] = useState<number[]>([]);
  const [previewData, setPreviewData] = useState<any>(null);
  const [previewingVersionId, setPreviewingVersionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingActive, setIsUpdatingActive] = useState(false);
  const [isDeletingVersion, setIsDeletingVersion] = useState<number | null>(null);
  const [isTogglingLock, setIsTogglingLock] = useState<number | null>(null);
  const [updatingVersionId, setUpdatingVersionId] = useState<number | null>(null);
  const { toast } = useToast();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedVersions(versions.map((v) => v.id));
    } else {
      setSelectedVersions([]);
    }
  };

  const handleSelectVersion = (id: number) => {
    setSelectedVersions((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  const handleToggleActive = async (id: number, currentState: boolean) => {
    setUpdatingVersionId(id);
    try {
      await axiosInstance.post(`/admin/lands/toggle-active/${id}`, { is_active: !currentState });
      toast({
        title: "Success",
        description: `Version ${currentState ? "deactivated" : "activated"} successfully`,
      });
      // Refetch data to update the UI
      await onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${currentState ? "deactivate" : "activate"} version`,
        variant: "destructive",
      });
    } finally {
      setUpdatingVersionId(null);
      window.location.reload();
    }
  };

  const handleDeleteSelected = async () => {
    setIsDeletingVersion(-1); // Use -1 to indicate multiple deletions
    try {
      await Promise.all(selectedVersions.map((id) => axiosInstance.delete(`/admin/lands/versions/${id}`)));
      toast({
        title: "Success",
        description: "Selected versions deleted successfully",
      });
      setSelectedVersions([]);
      await onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete selected versions",
        variant: "destructive",
      });
    } finally {
      setIsDeletingVersion(null);
    }
  };

  const handleToggleLock = async (id: number, currentLockState: boolean) => {
    setIsTogglingLock(id);
    try {
      if (currentLockState) {
        await axiosInstance.post(`/admin/lands/unlock/${id}`);
      } else {
        await axiosInstance.post(`/admin/lands/lock/${id}`);
      }
      toast({
        title: "Success",
        description: `Lands ${currentLockState ? "unlocked" : "locked"} successfully`,
      });
      await onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${currentLockState ? "unlock" : "lock"} lands`,
        variant: "destructive",
      });
    } finally {
      setIsTogglingLock(null);
    }
  };

  const handlePreview = async (id: number) => {
    try {
      setIsLoading(true);
      setPreviewingVersionId(id);
      const response = await axiosInstance.get(`/admin/lands/versions/${id}`);
      setPreviewData(JSON.parse(response.data.data));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load preview data",
        variant: "destructive",
      });
      setPreviewingVersionId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClosePreview = () => {
    setPreviewingVersionId(null);
    setPreviewData(null);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="select-all" checked={selectedVersions.length === versions.length} onCheckedChange={handleSelectAll} />
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
            <TableHead>Active</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {versions.map((version: Version) => (
            <TableRow key={version.id}>
              <TableCell>
                <Checkbox checked={selectedVersions.includes(version.id)} onCheckedChange={() => handleSelectVersion(version.id)} />
              </TableCell>
              <TableCell>{version.file_name}</TableCell>
              <TableCell>{version.version_name}</TableCell>
              <TableCell>{new Date(version.created_at).toLocaleString()}</TableCell>
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
