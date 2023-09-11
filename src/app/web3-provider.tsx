"use client";

import { mainnet, configureChains, WagmiConfig, createConfig } from "wagmi";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { arbitrum, hardhat, polygon, polygonMumbai } from "wagmi/chains";

const chains = [arbitrum, mainnet, polygon, hardhat, polygonMumbai];
const projectId = "408625d84ea65470d28a9bc36684517d";

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, chains }),
    publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

export default function Web3ModalProvider({ children }: { children: React.ReactNode }) {
    return (
        <>
            <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
            <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
        </>
    );
}
