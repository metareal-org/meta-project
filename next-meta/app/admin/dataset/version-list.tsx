"use client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import axiosInstance from "@/lib/axios-instance";
import { useToast } from "@/components/ui/use-toast";
import dynamic from "next/dynamic";
import { Lock, Unlock } from "lucide-react";
import { useEffect, useState } from "react";

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
  onUpdate: () => void;
}

const VersionList: React.FC<VersionListProps> = ({ versions, onUpdate }) => {
  const [activeVersions, setActiveVersions] = useState<number[]>([]);
  const [previewData, setPreviewData] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setActiveVersions(versions.filter((v) => v.is_active).map((v) => v.id));
  }, [versions]);

  const handleCheckboxChange = (id: number) => {
    setActiveVersions((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  const handleUpdateActiveVersions = async () => {
    try {
      await axiosInstance.post("/admin/lands/update-active-versions", { active_versions: activeVersions });
      toast({
        title: "Success",
        description: "Active versions updated successfully",
      });
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update active versions",
        variant: "destructive",
      });
    }
  };

  const handleDeleteVersion = async (id: number) => {
    try {
      await axiosInstance.delete(`/admin/lands/versions/${id}`);
      toast({
        title: "Success",
        description: "Version deleted successfully",
      });
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete version",
        variant: "destructive",
      });
    }
  };

  const handlePreview = async (id: number) => {
    try {
      const response = await axiosInstance.get(`/admin/lands/versions/${id}`);
      setPreviewData(JSON.parse(response.data.data));
      setIsPreviewOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load preview data",
        variant: "destructive",
      });
    }
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewData(null);
  };

  const handleToggleLock = async (id: number, currentLockState: boolean) => {
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
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${currentLockState ? "unlock" : "lock"} lands`,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Active</TableHead>
            <TableHead>File Name</TableHead>
            <TableHead>Version Name</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {versions.map((version: Version) => (
            <TableRow key={version.id}>
              <TableCell>
                <Checkbox checked={activeVersions.includes(version.id)} onCheckedChange={() => handleCheckboxChange(version.id)} />
              </TableCell>
              <TableCell>{version.file_name}</TableCell>
              <TableCell>{version.version_name}</TableCell>
              <TableCell>{new Date(version.created_at).toLocaleString()}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => handlePreview(version.id)}>Preview</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[800px]" onInteractOutside={handleClosePreview} onEscapeKeyDown={handleClosePreview}>
                      <DialogHeader>
                        <DialogTitle>Land Preview</DialogTitle>
                      </DialogHeader>
                      {previewData && <LandMapPreview geoJsonData={previewData} />}
                    </DialogContent>
                  </Dialog>
                  <Button
                    onClick={() => handleToggleLock(version.id, version.is_locked)}
                    variant={version.is_locked ? "destructive" : "default"}
                    className="w-[100px]"
                  >
                    {version.is_locked ? (
                      <>
                        <Unlock className="mr-2 h-4 w-4" /> Unlock
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" /> Lock
                      </>
                    )}
                  </Button>
                  <Button onClick={() => handleDeleteVersion(version.id)} variant="destructive">
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={handleUpdateActiveVersions} className="mt-4">
        Update Active Versions
      </Button>
    </>
  );
};

export default VersionList;
