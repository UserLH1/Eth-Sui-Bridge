// src/bridge/ethereum.ts - Modulul Ethereum
import { ethers } from "ethers";

import { BurnEventHandler, EthereumConfig } from "./types";
console.log("Hello from Ethereum Bridge!");

export class EthereumBridge {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;
  private listeners: ethers.Listener[] = [];

  constructor(config: EthereumConfig) {
    this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
    this.wallet = new ethers.Wallet(config.privateKey, this.provider);

    this.contract = new ethers.Contract(
      config.contractAddress,
      [
        "event Burn(address indexed from, uint256 amount)",
        "function mint(address to, uint256 amount)",
      ],
      this.wallet
    );
  }

  async listenForBurnEvents(handler: BurnEventHandler) {
    const listener = (from: string, amount: BigInt, event: ethers.EventLog) => {
      handler(from, amount.toString());
    };

    this.contract.on("Burn", listener);
    this.listeners.push(listener);
  }

  async mint(to: string, amount: string) {
    const tx = await this.contract.mint(to, amount);
    await tx.wait();
    console.log(`✅ Minted ${amount} ITB on Ethereum to ${to}`);
    return tx.hash;
  }

  async disconnect() {
    this.listeners.forEach((listener) => this.contract.off("Burn", listener));
    this.listeners = [];
  }
}
