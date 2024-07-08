'use client'
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { WagmiProvider } from "wagmi";
import { bscTestnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient();
const projectId = "6a1fbd37940215489abd38edd45e9f0a";
const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "http://localhost:3000/",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};
const chains = [bscTestnet] as const;
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});
createWeb3Modal({
  wagmiConfig: config,
  projectId,
});

export function Web3ModalProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
