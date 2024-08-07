// store/admin-store/useAdminLandVersionStore.ts

import { create } from "zustand";
import axiosInstance from "@/lib/axios-instance";

interface LandVersion {
  id: number;
  file_name: string;
  version_name: string;
  is_active: boolean;
  is_locked: boolean;
  type: string;
  created_at: string;
}

interface AdminLandVersionStore {
  versions: LandVersion[];
  selectedVersions: number[];
  file: File | null;
  fileName: string;
  versionName: string;
  type: string;
  adminHandleFileChange: (file: File) => void;
  adminHandleImport: () => Promise<void>;
  adminSetFileName: (name: string) => void;
  adminSetVersionName: (name: string) => void;
  adminSetType: (type: string) => void;
  adminFetchLandVersions: () => Promise<void>;
  adminSelectAllVersions: (checked: boolean) => void;
  adminSelectVersion: (id: number) => void;
  adminToggleVersionActive: (id: number, currentState: boolean) => Promise<void>;
  adminDeleteSelectedVersions: () => Promise<void>;
  adminToggleVersionLock: (id: number, currentLockState: boolean) => Promise<void>;
  adminPreviewVersion: (id: number) => Promise<any>;
  adminUpdateLandType: (id: number, type: string) => Promise<void>;
}

export const useAdminLandVersionStore = create<AdminLandVersionStore>((set, get) => ({
  versions: [],
  selectedVersions: [],
  file: null,
  fileName: "",
  versionName: "",
  type: "normal",
  adminHandleFileChange: (file) => set({ file }),
  adminHandleImport: async () => {
    const { file, fileName, versionName, type } = get();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("file_name", fileName);
    formData.append("version_name", versionName);
    formData.append("type", type);

    try {
      await axiosInstance.post("/admin/lands/import", formData);
      await get().adminFetchLandVersions();
    } catch (error) {
      console.error("Import failed:", error);
    }
  },
  adminSetFileName: (name) => set({ fileName: name }),
  adminSetVersionName: (name) => set({ versionName: name }),
  adminSetType: (type) => set({ type }),
  adminFetchLandVersions: async () => {
    try {
      const response = await axiosInstance.get("/admin/lands/versions");
      set({ versions: response.data });
    } catch (error) {
      console.error("Fetch versions failed:", error);
    }
  },
  adminSelectAllVersions: (checked) => {
    const { versions } = get();
    set({ selectedVersions: checked ? versions.map((v) => v.id) : [] });
  },
  adminSelectVersion: (id) => {
    const { selectedVersions } = get();
    set({
      selectedVersions: selectedVersions.includes(id) ? selectedVersions.filter((v) => v !== id) : [...selectedVersions, id],
    });
  },
  adminToggleVersionActive: async (id, currentState) => {
    try {
      await axiosInstance.post(`/admin/lands/toggle-active/${id}`);
      await get().adminFetchLandVersions();
    } catch (error) {
      console.error("Toggle active failed:", error);
    }
  },
  adminDeleteSelectedVersions: async () => {
    const { selectedVersions } = get();
    try {
      await Promise.all(selectedVersions.map((id) => axiosInstance.delete(`/admin/lands/versions/${id}`)));
      await get().adminFetchLandVersions();
      set({ selectedVersions: [] });
    } catch (error) {
      console.error("Delete versions failed:", error);
    }
  },
  adminToggleVersionLock: async (id, currentLockState) => {
    try {
      await axiosInstance.post(`/admin/lands/${currentLockState ? "unlock" : "lock"}/${id}`);
      await get().adminFetchLandVersions();
    } catch (error) {
      console.error("Toggle lock failed:", error);
    }
  },
  adminPreviewVersion: async (id) => {
    try {
      const response = await axiosInstance.get(`/admin/lands/versions/${id}`);
      return response.data;
    } catch (error) {
      console.error("Preview version failed:", error);
      return null;
    }
  },
  adminUpdateLandType: async (id, type) => {
    try {
      await axiosInstance.post(`/admin/lands/versions/${id}/update-type`, { type });
      await get().adminFetchLandVersions();
    } catch (error) {
      console.error("Update land type failed:", error);
    }
  },
}));
