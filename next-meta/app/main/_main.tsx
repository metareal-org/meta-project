// app/main/page.tsx
"use client";
import GameEngine from "@/components/game-engine";
import GameInterface from "@/components/game-interface";
import GemProgressBar from "@/components/game-interface/gemconter";
import GetLocation from "@/helpers/get-location";
import { Fragment } from "react";
import MissionsManager from "@/components/game-engine/missions";
import SpinWheel from "@/components/minigames/spinwheel";
import { Button } from "@/components/ui/button";
import { useDisconnect } from "wagmi";

export default function Main() {
  const { disconnect } = useDisconnect();
  return (
    <Fragment>
      <div className="fixed pointer-events-auto z-50 bottom-24 left-24">
        <Button
          onClick={() => {
            disconnect();
          }}
        >
          logout
        </Button>
      </div>
      <MissionsManager />
      <GameInterface />
      <SpinWheel />
      <GameEngine />
      <GetLocation />
      <GemProgressBar />
    </Fragment>
  );
}
