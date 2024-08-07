import useLandStore from "@/store/world-store/useLandStore";
import NormalDrawer from "./nomral-drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import MineDrawer from "./mine-drawer";

export default function BuildingDrawer() {
  const { currentLandDetails, isLoading, selectedLandId } = useLandStore();

  if (selectedLandId === null) {
    return null;
  }

  if (isLoading) {
    return <LoadingDrawer />;
  }

  if (currentLandDetails?.type === "normal") {
    return <NormalDrawer />;
  }

  if (currentLandDetails?.type === "mine") {
    return <MineDrawer />;
  }

  return null;
}

function LoadingDrawer() {
  return (
    <div className="fixed z-50 inset-x-0 scale-100 origin-bottom bottom-0 mx-auto w-full max-w-sm bg-black shadow-lg rounded-t-2xl">
      <div className="p-4">
        <div className="flex items-center justify-center h-[160px] bg-black-1000/20 rounded-lg mb-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        </div>
        <Skeleton className="h-6 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        <div className="flex justify-center">
          <Skeleton className="h-10 w-3/4" />
        </div>
      </div>
    </div>
  );
}