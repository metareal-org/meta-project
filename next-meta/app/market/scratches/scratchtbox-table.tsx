import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScratchBox } from "./types";

interface ScratchBoxTableProps {
  scratchBoxes: ScratchBox[];
  bnbBalance?: number;
  onBuy?: (id: number) => void;
  onOpen?: (box: ScratchBox) => void;
  mode: "buy" | "owned";
}

export const ScratchBoxTable: React.FC<ScratchBoxTableProps> = ({ scratchBoxes, bnbBalance, onBuy, onOpen, mode }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scratchBoxes.map((box) => {
          const isDisabled = mode === "buy" ? box.status === "sold" : box.status === "opened";
          return (
            <TableRow key={box.id} className={isDisabled ? "opacity-50" : ""}>
              <TableCell>
                <img src="/assets/images/tokens/scretch.jpg" alt="" className="w-20 h-20 object-cover rounded-lg" />
              </TableCell>
              <TableCell>{box.name}</TableCell>
              <TableCell>
                <Badge>{box.type === "single" ? "Single Land" : "Multiple Lands"}</Badge>
              </TableCell>
              <TableCell>{box.price} BNB</TableCell>
              <TableCell>
                {box.size} M<sup>2</sup>
              </TableCell>
              <TableCell>{box.status}</TableCell>
              <TableCell>{new Date(box.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                {mode === "buy" && (
                  <Button
                    onClick={() => onBuy && onBuy(box.id)}
                    disabled={isDisabled || (bnbBalance !== undefined && bnbBalance < box.price)}
                    className={`w-full ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {box.status === "sold" ? "Sold" : bnbBalance !== undefined && bnbBalance < box.price ? "Insufficient BNB" : "Buy Now"}
                  </Button>
                )}
                {mode === "owned" && (
                  <Button onClick={() => onOpen && onOpen(box)} disabled={isDisabled}    className={`w-full ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}>
                    {box.status === "opened" ? "Opened" : "Open"}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
