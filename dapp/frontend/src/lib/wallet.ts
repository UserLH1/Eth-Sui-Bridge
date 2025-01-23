import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client"; // Corectat importul
import { createWalletClient, custom } from "viem";
import { mainnet } from "viem/chains";

// Configurare rețele Sui
export const { networkConfig } = createNetworkConfig({
  localnet: {
    url: getFullnodeUrl("localnet"),
    websocketUrl: "ws://localhost:9001",
  },
  devnet: {
    url: getFullnodeUrl("devnet"),
    websocketUrl: "wss://fullnode.devnet.sui.io:443",
  },
});

// Client Sui manual
export const suiClient = new SuiClient({
  url: networkConfig.localnet.url,
});

// Provider Ethereum
export const ethClient = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum!),
});

// Tipuri exportate
export type { SuiClientProvider, WalletProvider };
