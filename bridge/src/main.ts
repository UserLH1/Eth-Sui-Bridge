// src/main.ts - Pornirea aplicației
import { fromExportedKeypair } from "@mysten/sui.js";
import { CrossChainBridge } from "./bridge";

// Configurare din .env
const config = {
  ethereum: {
    rpcUrl: process.env.ETH_RPC_URL!,
    privateKey: process.env.ETH_PRIVATE_KEY!,
    contractAddress: process.env.ETH_CONTRACT_ADDRESS!,
  },
  sui: {
    rpcUrl: process.env.SUI_RPC_URL!,
    keypair: fromExportedKeypair(JSON.parse(process.env.SUI_KEYPAIR!)),
    packageId: process.env.SUI_PACKAGE_ID!,
  },
};

const bridge = new CrossChainBridge(config);

// Pornire bridge
bridge.start();

// Graceful shutdown
process.on("SIGINT", async () => {
  await bridge.stop();
  process.exit();
});
