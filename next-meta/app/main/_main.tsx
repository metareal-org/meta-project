// app/main/_main.tsx
"use client";
import GameEngine from "@/components/game-engine";
import GameInterface from "@/components/game-interface/_game-interface";
import GetLocation from "@/helpers/get-location";
import { Fragment, useEffect, useState } from "react";
import MissionsManager from "@/components/game-engine/missions";
import SpinWheel from "@/components/minigames/spinwheel/_spinwheel";
import { Toaster } from "@/components/ui/toaster";
import { Web3ModalProvider } from "@/components/game-engine/web3";
export default function Main() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <Fragment>
      <Web3ModalProvider>
        <GameInterface />
        <MissionsManager />
        <SpinWheel />
        <GameEngine />
        <GetLocation />
        <Toaster />
      </Web3ModalProvider>
    </Fragment>
  );
}
