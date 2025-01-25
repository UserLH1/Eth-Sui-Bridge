export const bridgeConfig = {
  ethereum: {
    rpcUrl: import.meta.env.VITE_ETH_RPC_URL,
    privateKey: import.meta.env.VITE_ETH_PRIVATE_KEY,
    contractAddress: import.meta.env.VITE_ETH_CONTRACT_ADDRESS,
  },
  sui: {
    rpcUrl: import.meta.env.VITE_SUI_RPC_URL,
    privateKey: hexToUint8Array(import.meta.env.VITE_SUI_PRIVATE_KEY!),
    packageId: import.meta.env.VITE_SUI_PACKAGE_ID,
  },
};

// Helper pentru conversie hex → Uint8Array
function hexToUint8Array(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}
