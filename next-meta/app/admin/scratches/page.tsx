"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ScratchBoxList from "./scratch-box-list";

export default function AdminScratchBoxes() {
  

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Scratch Boxes</CardTitle>
      </CardHeader>
      <CardContent>
        <ScratchBoxList/>
      </CardContent>
    </Card>
  );
}