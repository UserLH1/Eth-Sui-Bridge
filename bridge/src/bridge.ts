// src/bridge/index.ts - Punctul central de integrare
import { EthereumBridge } from "./ethereum";
import { SuiBridge } from "./sui";
import { BridgeConfig } from "./types";

export class CrossChainBridge {
  private ethBridge: EthereumBridge;
  private suiBridge: SuiBridge;
  private isRunning: boolean;

  constructor(config: BridgeConfig) {
    this.ethBridge = new EthereumBridge(config.ethereum);
    this.suiBridge = new SuiBridge(config.sui);
    this.isRunning = false;
  }

  async start() {
    if (this.isRunning) return;

    // Ascultăm evenimente pe ambele rețele
    await this.ethBridge.listenForBurnEvents(this.handleEthBurn);
    await this.suiBridge.listenForBurnEvents(this.handleSuiBurn);

    this.isRunning = true;
    console.log("Bridge started 🚀");
  }

  async stop() {
    await this.ethBridge.disconnect();
    await this.suiBridge.disconnect();
    this.isRunning = false;
    console.log("Bridge stopped 🔴");
  }

  private handleEthBurn = async (from: string, amount: string) => {
    console.log(`🔥 Ethereum burn detected: ${amount} ITB from ${from}`);

    // 1. Convertim amount la decimals-ul Sui (presupunem 1e18 pe Eth → 1e9 pe Sui)
    const suiAmount = (BigInt(amount) / 10n ** 9n).toString();

    // 2. Executăm mint pe Sui
    await this.suiBridge.mint(from, suiAmount);
  };

  private handleSuiBurn = async (from: string, amount: string) => {
    console.log(`🔥 Sui burn detected: ${amount} ITB from ${from}`);

    // 1. Convertim amount la decimals-ul Ethereum
    const ethAmount = (BigInt(amount) * 10n ** 9n).toString();

    // 2. Executăm mint pe Ethereum
    await this.ethBridge.mint(from, ethAmount);
  };
}
