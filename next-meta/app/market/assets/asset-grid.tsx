import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import useAssetStore from "@/store/player-store/useAssetStore";
import { Button } from "@/components/ui/button";

interface Asset {
  type: string;
  imgSrc: string;
  className?: string;
  hideInInventory?: boolean;
}

interface AssetGridProps {
  assets: Asset[];
  loading: boolean;
  search: string;
  sortBy: string;
  sortOrder: string;
  onItemClick: (type: string, amount: number) => void;
}

const AssetGrid: React.FC<AssetGridProps & { onSell: (type: string) => void }> = ({ assets, loading, search, sortBy, sortOrder, onItemClick, onSell }) => {
  const { getAssetAmount } = useAssetStore();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  const filteredAssets = assets.filter((asset) => !asset.hideInInventory && asset.type.toLowerCase().includes(search.toLowerCase()));

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    const amountA = getAssetAmount(a.type as any);
    const amountB = getAssetAmount(b.type as any);
    if (sortBy === "type") {
      return sortOrder === "asc" ? a.type.localeCompare(b.type) : b.type.localeCompare(a.type);
    } else {
      return sortOrder === "asc" ? amountA - amountB : amountB - amountA;
    }
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {sortedAssets.map((asset) => (
        <AssetCard key={asset.type} asset={asset} amount={getAssetAmount(asset.type as any)} onClick={onItemClick} onSell={onSell} />
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

const AssetCard = ({
  asset,
  amount,
  onClick,
  onSell,
}: {
  asset: Asset;
  amount: number;
  onClick: (type: string, amount: number) => void;
  onSell: (type: string) => void;
}) => {
  const formatAssetType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Card
      className={`overflow-hidden transition-all hover:shadow-lg cursor-pointer bg-black-950 border-black-700 ${asset.className || ""}`}
      onClick={() => onClick(asset.type, amount)}
    >
      <CardHeader className="p-3">
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <img src={asset.imgSrc} alt={asset.type} className="w-full h-full object-cover bg-black-900" />
          <Badge className="absolute top-2 right-2 bg-black-600 text-white text-xs px-2 py-1">{formatAssetType(asset.type)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-2 flex flex-col items-center justify-between">
        <div className="flex pb-4 justify-between items-center w-full">
          <div className=" font-medium  text-black-200 truncate">{formatAssetType(asset.type)}</div>
          <div className="border border-teal rounded bg-teal-fg px-3  text-sm text-black-100 "> {amount}</div>
        </div>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onSell(asset.type);
          }}
          variant="secondary"
          className="w-full"
        >
          Sell
        </Button>
      </CardContent>
    </Card>
  );
};

export default AssetGrid;
