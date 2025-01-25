// src/bridge/types.ts - Tipurile comune
export type BridgeConfig = {
  ethereum: EthereumConfig;
  sui: SuiConfig;
};

export type EthereumConfig = {
  rpcUrl: string;
  privateKey: string;
  contractAddress: string;
};

export type SuiConfig = {
  rpcUrl: string;
  packageId: string;
  privateKey: Uint8Array;
};

export type BurnEventHandler = (from: string, amount: string) => void;
