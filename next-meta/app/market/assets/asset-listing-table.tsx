import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AssetListing } from './types';
import { Button } from '@/components/ui/button';

interface AssetListingsTableProps {
  listings: AssetListing[];
  onBuy?: (listingId: number) => void;
  onRemove?: (listingId: number) => void;
  loading: boolean;
  isOwnListings?: boolean;
}

export const AssetListingsTable: React.FC<AssetListingsTableProps> = ({ 
  listings, 
  onBuy, 
  onRemove, 
  loading, 
  isOwnListings = false 
}) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Asset Type</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Price (BNB)</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {listings.map((listing) => (
          <TableRow key={listing.id}>
            <TableCell>{listing.asset_type}</TableCell>
            <TableCell>{listing.amount}</TableCell>
            <TableCell>{listing.price_in_bnb}</TableCell>
            <TableCell>
              {isOwnListings ? (
                <Button onClick={() => onRemove && onRemove(listing.id)}>Remove</Button>
              ) : (
                <Button onClick={() => onBuy && onBuy(listing.id)}>Buy</Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};