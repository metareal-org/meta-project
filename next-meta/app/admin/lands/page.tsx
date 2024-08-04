// app/admin/dashboard/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LandList from "./land-list";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios-instance";

export default function AdminLands() {
  const [lands, setLands] = useState([]);
  const [allLandIds, setAllLandIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLands = async (page = 1) => {
    try {
      const response = await axiosInstance.get(`/admin/manage/lands?page=${page}`);
      setLands(Array.isArray(response.data.data) ? response.data.data : []);
      setCurrentPage(response.data.current_page);
      setTotalPages(response.data.last_page);
    } catch (error) {
      console.error("Failed to fetch lands:", error);
      setLands([]);
    }
  };

  const fetchAllLandIds = async () => {
    try {
      const response = await axiosInstance.get('/admin/manage/lands/all-ids');
      setAllLandIds(response.data);
    } catch (error) {
      console.error("Failed to fetch all land IDs:", error);
    }
  };

  useEffect(() => {
    fetchLands();
    fetchAllLandIds();
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchLands(newPage);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-4xl font-normal">Manage Lands</CardTitle>
      </CardHeader>
      <CardContent>
        <LandList 
          lands={lands} 
          allLandIds={allLandIds}
          onUpdate={() => {
            fetchLands();
            fetchAllLandIds();
          }}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </CardContent>
    </Card>
  );
}