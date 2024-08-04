// D:\met-clone\next-meta\app\market\components\FilterControls.tsx

import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface FilterControlsProps {
  search: string
  onSearch: (value: string) => void
  sortBy: string
  sortOrder: string
  onSort: (sortBy: string) => void
  showOnlyForSale: boolean
  onForSaleFilter: (value: boolean) => void
}

const FilterControls: React.FC<FilterControlsProps> = ({
  search,
  onSearch,
  sortBy,
  sortOrder,
  onSort,
  showOnlyForSale,
  onForSaleFilter,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <Input 
        type="text" 
        placeholder="Search lands..." 
        value={search} 
        onChange={(e) => onSearch(e.target.value)}
        className="w-full md:w-auto flex-grow"
      />
      <Button onClick={() => onSort('fixed_price')}>
        Sort by Price {sortBy === 'fixed_price' && (sortOrder === 'asc' ? '↑' : '↓')}
      </Button>
      <div className="flex items-center space-x-2">
        <Switch
          id="for-sale-filter"
          checked={showOnlyForSale}
          onCheckedChange={onForSaleFilter}
        />
        <Label htmlFor="for-sale-filter">Show only for sale</Label>
      </div>
    </div>
  )
}

export default FilterControls