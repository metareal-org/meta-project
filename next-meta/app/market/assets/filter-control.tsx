import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface FilterControlsProps {
  search: string
  onSearch: (value: string) => void
  sortBy: string
  sortOrder: string
  onSort: (sortBy: string) => void
}

const FilterControls: React.FC<FilterControlsProps> = ({
  search,
  onSearch,
  sortBy,
  sortOrder,
  onSort,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <Input 
        type="text" 
        placeholder="Search assets..." 
        value={search} 
        onChange={(e) => onSearch(e.target.value)}
        className="w-full md:w-auto flex-grow"
      />
      <Button onClick={() => onSort('type')}>
        Sort by Type {sortBy === 'type' && (sortOrder === 'asc' ? '↑' : '↓')}
      </Button>
      <Button onClick={() => onSort('amount')}>
        Sort by Amount {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
      </Button>
    </div>
  )
}

export default FilterControls