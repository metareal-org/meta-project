import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LandWithDetails } from "@/store/world-store/useLandStore";

interface WonLandsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wonLands: LandWithDetails[];
}

export const WonLandsDialog: React.FC<WonLandsDialogProps> = ({ open, onOpenChange, wonLands }) => {
  const totalSize = wonLands.reduce((sum, land) => sum + land.size, 0);
  const totalValue = wonLands.reduce((sum, land) => sum + (land.fixed_price || 0), 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-6 bg-black-950 text-black-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">🎉 Congratulations!</DialogTitle>
        </DialogHeader>
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-black-900 p-3 rounded">
              <p className="text-sm text-black-400">Lands Won</p>
              <p className="text-xl font-bold">{wonLands.length}</p>
            </div>
            <div className="bg-black-900 p-3 rounded">
              <p className="text-sm text-black-400">Total Size</p>
              <p className="text-xl font-bold">{totalSize}</p>
            </div>
            <div className="bg-black-900 p-3 rounded">
              <p className="text-sm text-black-400">Total Value</p>
              <p className="text-xl font-bold">{totalValue != 0 ? totalValue.toFixed(2) : "-"}</p>
            </div>
            <div className="bg-black-900 p-3 rounded">
              <p className="text-sm text-black-400">Avg. Size</p>
              <p className="text-xl font-bold">{(totalSize / wonLands.length).toFixed(2)}</p>
            </div>
          </div>
          <div className="overflow-auto max-h-[50vh]">
            <table className="w-full text-sm">
              <thead className="bg-black-900 sticky top-0">
                <tr>
                  <th className="p-2 text-left font-semibold">ID</th>
                  <th className="p-2 text-left font-semibold">Type</th>
                  <th className="p-2 text-left font-semibold">Size</th>
                  <th className="p-2 text-left font-semibold">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black-700">
                {wonLands.map((land) => (
                  <tr key={land.id} className="hover:bg-black-900">
                    <td className="p-2">{land.full_id}</td>
                    <td className="p-2">{land.type} Land</td>
                    <td className="p-2">{land.size}</td>
                    <td className="p-2">{land.fixed_price || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
