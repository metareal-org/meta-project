// app/main/_main.tsx
"use client";
import GameEngine from "@/components/game-engine";
import GameInterface from "@/components/game-interface";
import GemProgressBar from "@/components/game-interface/gemconter";
import GetLocation from "@/helpers/get-location";
import { Fragment, useEffect, useState } from "react";
import MissionsManager from "@/components/game-engine/missions";
import SpinWheel from "@/components/minigames/spinwheel";
import { Toaster } from "@/components/ui/toaster";

export default function Main() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <Fragment>
      <MissionsManager />
      <GameInterface />
      <SpinWheel />
      <GameEngine />
      <GetLocation />
      <GemProgressBar />
      <Toaster />
    </Fragment>
  );
}
