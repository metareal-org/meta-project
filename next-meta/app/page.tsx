"use client";
import Main from "@/app/main/_main";
import { Web3ModalProvider } from "@/components/game-engine/web3";
export default function Home() {
  return (
    <Web3ModalProvider>
      <Main />
    </Web3ModalProvider>
  );
}
