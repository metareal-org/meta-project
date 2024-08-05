import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AssetListing } from "./types";

interface AssetListingsGridProps {
  listings: AssetListing[];
  onBuy?: (listingId: number) => void;
  onRemove?: (listingId: number) => void;
  loading: boolean;
  isOwnListings?: boolean;
}

export const AssetListingsGrid: React.FC<AssetListingsGridProps> = ({ listings, onBuy, onRemove, loading, isOwnListings }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {listings.map((listing) => (
        <AssetCard key={listing.id} listing={listing} onBuy={onBuy} onRemove={onRemove} isOwnListing={isOwnListings} />
      ))}
    </div>
  );
};

const SkeletonCard = () => (
  <Card className="overflow-hidden bg-black-950 border-black-700">
    <CardHeader className="p-0">
      <Skeleton className="w-full h-48 bg-black-700" />
    </CardHeader>
    <CardContent className="p-4">
      <Skeleton className="h-6 w-2/3 mb-2 bg-black-700" />
      <Skeleton className="h-4 w-1/2 bg-black-700" />
    </CardContent>
  </Card>
);

const AssetCard = ({ listing, onBuy, onRemove, isOwnListing }: { 
  listing: AssetListing; 
  onBuy?: (listingId: number) => void;
  onRemove?: (listingId: number) => void;
  isOwnListing?: boolean;
}) => {
  const formatAssetType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Card
      className={`overflow-hidden transition-all hover:shadow-lg cursor-pointer bg-black-950 border-black-700 ${listing.className || ""}`}
    >
      <CardHeader className="p-3">
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <img src={`/assets/images/inventory/${listing.asset_type}_icon.webp`} alt={listing.asset_type} className="w-full h-full object-cover bg-black-900" />
          <Badge className="absolute top-2 right-2 bg-black-600 text-white text-xs px-2 py-1">{formatAssetType(listing.asset_type)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-2 flex flex-col items-center justify-between">
        <div className="flex pb-4 justify-between items-center w-full">
          <div className="font-medium text-black-200 truncate">{formatAssetType(listing.asset_type)}</div>
          <div className="border border-teal rounded bg-teal-fg px-3 text-sm text-black-100">{listing.amount}</div>
        </div>
        <div className="flex justify-between items-center w-full mb-4">
          <div className="text-sm text-black-100">Price:</div>
          <div className="text-sm text-black-100">{listing.price_in_bnb} BNB</div>
        </div>
        {isOwnListing ? (
          <Button
            onClick={() => onRemove && onRemove(listing.id)}
            variant="destructive"
            className="w-full"
          >
            Remove
          </Button>
        ) : (
          <Button
            onClick={() => onBuy && onBuy(listing.id)}
            variant="secondary"
            className="w-full"
          >
            Buy
          </Button>
        )}
      </CardContent>
    </Card>
  );
};