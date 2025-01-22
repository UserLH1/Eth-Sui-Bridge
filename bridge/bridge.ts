import * as dotenv from "dotenv";
import { ethers } from "ethers";
import { WebsocketClient } from "./sui-websocket"; // Importă direct fișierul TypeScript

dotenv.config();

// Configurare Ethereum
const ethereumProvider = new ethers.JsonRpcProvider(
  process.env.ETHEREUM_RPC_URL
);
const ethereumWallet = new ethers.Wallet(
  process.env.ETHEREUM_PRIVATE_KEY!,
  ethereumProvider
);
const IBT_ABI = [
  "event Burn(address indexed from, uint256 amount)",
  "function mint(address to, uint256 amount) public",
];
const ibtEthereumContract = new ethers.Contract(
  process.env.ETHEREUM_CONTRACT_ADDRESS!, // Adresa contractului Ethereum
  IBT_ABI,
  ethereumWallet
);

// Configurare Sui WebSocket Client
const suiWebsocket = new WebsocketClient(process.env.SUI_RPC_URL!, {
  callTimeout: 30000,
  reconnectTimeout: 3000,
  maxReconnects: 5,
});

async function listenForSuiEvents() {
  console.log("Subscribing to Sui Burn events...");

  const unsubscribe = await suiWebsocket.subscribe({
    method: "sui_subscribeEvent",
    unsubscribe: "sui_unsubscribeEvent",
    params: [
      {
        filter: {
          MoveEventType: `${process.env.PACKAGE_ID}::ibt::BurnEvent`,
        },
      },
    ],
    onMessage: async (event: {
      params: { result: { from_addr: string; amount: string } };
    }) => {
      console.log("Received Burn event on Sui:", event);
      const { from_addr, amount } = event.params.result;

      console.log(
        `Minting ${amount} IBT on Ethereum for address ${from_addr}...`
      );
      const tx = await ibtEthereumContract.mint(from_addr, amount);
      await tx.wait();
      console.log("Minted on Ethereum:", tx.hash);
    },
  });

  setTimeout(() => {
    console.log("Unsubscribing from Sui events...");
    unsubscribe();
  }, 60000); // Dezabonare automată după 60 de secunde
}

async function main() {
  console.log("Starting bridge...");
  console.log("Ethereum wallet loaded:", ethereumWallet.address);

  await listenForSuiEvents();
}

main().catch((error) => {
  console.error("Error in bridge:", error);
  process.exit(1);
});
