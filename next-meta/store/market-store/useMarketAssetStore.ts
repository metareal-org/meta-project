import { create } from 'zustand';
import { AssetListing } from '@/app/market/assets/types';
import axiosInstance from '@/lib/axios-instance';
import { toast } from '@/components/ui/use-toast';
import { useUserStore } from '../player-store/useUserStore';

interface MarketAssetStore {
  listings: AssetListing[];
  ownListings: AssetListing[];
  loading: boolean;
  marketCreateAssetListing: (data: { asset_type: string; amount: number; price_in_bnb: number }) => Promise<void>;
  marketFetchListings: () => Promise<void>;
  marketBuyAsset: (listingId: number) => Promise<void>;
  marketRemoveListing: (listingId: number) => Promise<void>;
}

const useMarketAssetStore = create<MarketAssetStore>((set, get) => ({
  listings: [],
  ownListings: [],
  loading: false,

  marketCreateAssetListing: async (data) => {
    try {
      const response = await axiosInstance.post("/asset-listings", data);
      if (response.data && response.data.listing) {
        toast({ title: "Success", description: "Listing created successfully!" });
        get().marketFetchListings();
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error: any) {
      console.error("Error creating listing:", error);
      let errorMessage = "Failed to create listing";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
  },

  marketFetchListings: async () => {
    try {
      set({ loading: true });
      const response = await axiosInstance.get("/asset-listings");
      const allListings = response.data.listings;
      const userId = useUserStore.getState().user?.id ?? 0;
      set({
        listings: allListings.filter((listing: AssetListing) => listing.user_id !== userId),
        ownListings: allListings.filter((listing: AssetListing) => listing.user_id === userId),
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch asset listings", variant: "destructive" });
    } finally {
      set({ loading: false });
    }
  },

  marketBuyAsset: async (listingId: number) => {
    try {
      await axiosInstance.post(`/asset-listings/${listingId}/buy`);
      toast({ title: "Success", description: "Asset purchased successfully!" });
      get().marketFetchListings();
    } catch (error) {
      toast({ title: "Error", description: "Failed to purchase asset", variant: "destructive" });
    }
  },

  marketRemoveListing: async (listingId: number) => {
    try {
      await axiosInstance.delete(`/asset-listings/${listingId}`);
      toast({ title: "Success", description: "Listing removed successfully!" });
      get().marketFetchListings();
    } catch (error) {
      toast({ title: "Error", description: "Failed to remove listing", variant: "destructive" });
    }
  },
}));

export default useMarketAssetStore;