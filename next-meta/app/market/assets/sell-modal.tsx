import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSell: (data: { asset_type: string; amount: number; price_in_bnb: number }) => void;
  assetType: string;
  maxAmount: number;
}

export const SellModal: React.FC<SellModalProps> = ({ isOpen, onClose, onSell, assetType, maxAmount }) => {
  const [amount, setAmount] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleSell = () => {
    if (amount <= 0 || amount > maxAmount) {
      setError(`Amount must be between 1 and ${maxAmount}`);
      return;
    }
    if (price <= 0) {
      setError("Price must be greater than 0");
      return;
    }
    setError(null);
    onSell({
      asset_type: assetType,
      amount: amount,
      price_in_bnb: price,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sell {assetType}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} min={1} max={maxAmount} placeholder="Amount to sell" />
          <Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} min={0} step={0.00000001} placeholder="Price in BNB" />
          {error && <p className="text-red-500">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSell}>Create Listing</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
