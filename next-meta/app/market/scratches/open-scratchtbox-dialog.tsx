import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScratchBox } from "./types";

interface OpenScratchBoxDialogProps {
  selectedBox: ScratchBox | null;
  onClose: () => void;
  onConfirm: (id: number) => void;
}

export const OpenScratchBoxDialog: React.FC<OpenScratchBoxDialogProps> = ({
  selectedBox,
  onClose,
  onConfirm,
}) => {
  if (!selectedBox) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Open Scratch Box</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Are you sure you want to open {selectedBox.name}?</p>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onConfirm(selectedBox.id)}>Confirm</Button>
        </CardFooter>
      </Card>
    </div>
  );
};