import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ScratchBoxFiltersProps {
  onFilterChange: (filter: string) => void;
}

export const ScratchBoxFilters: React.FC<ScratchBoxFiltersProps> = ({ onFilterChange }) => {
  return (
    <div className="mb-4">
      <Select onValueChange={onFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="available">Available</SelectItem>
          <SelectItem value="sold">Sold</SelectItem>
          <SelectItem value="opened">Opened</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};