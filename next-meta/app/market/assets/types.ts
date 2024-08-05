export interface AssetListing {
  id: number;
  user_id: number;
  asset_type: string;
  amount: number;
  price_in_bnb: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  className?: string; // Add this line
}