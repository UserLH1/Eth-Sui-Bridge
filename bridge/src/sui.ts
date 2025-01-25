import { SuiClient, SuiEventFilter } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { BurnEventHandler, SuiConfig } from "./types";

export class SuiBridge {
  private client: SuiClient;
  private keypair: Ed25519Keypair;
  private packageId: string;
  private unsubscribe?: () => void;

  constructor(config: SuiConfig) {
    this.client = new SuiClient({ url: config.rpcUrl });
    this.keypair = Ed25519Keypair.fromSecretKey(config.privateKey);
    this.packageId = config.packageId;
  }

  async listenForBurnEvents(handler: BurnEventHandler) {
    const filter: SuiEventFilter = {
      MoveEventType: `${this.packageId}::ibt::BurnEvent`,
    };

    const unsubscribe = await this.client.subscribeEvent({
      filter,
      onMessage: (event) => {
        const [from, amount] = event.parsedJson as [string, string];
        handler(from, amount);
      },
    });

    this.unsubscribe = unsubscribe;
  }

  async mint(to: string, amount: string) {
    const tx = await this.client.executeMoveCall({
      packageObjectId: this.packageId,
      module: "ibt",
      function: "mint",
      typeArguments: [],
      arguments: [to, amount],
      gasBudget: 1000,
      signer: this.keypair,
    });

    console.log(`✅ Minted ${amount} ITB on Sui to ${to}`);
    return tx.digest;
  }

  async disconnect() {
    if (this.unsubscribe) {
      await this.unsubscribe();
    }
  }
}
