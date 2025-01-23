import { ethers } from "ethers";
import { createContext, useContext } from "react";
import { IBT_ABI } from "../lib/contracts";

type BridgeContextType = {
  bridgeToSui: (amount: string) => Promise<void>;
  bridgeToEth: (amount: string) => Promise<void>;
};

const BridgeContext = createContext<BridgeContextType>(null!);

export function useBridge() {
  return useContext(BridgeContext);
}

export function BridgeProvider({ children }: { children: React.ReactNode }) {
  const bridgeToSui = async (amount: string) => {
    const provider = new ethers.BrowserProvider(window.ethereum!);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      import.meta.env.VITE_ETH_CONTRACT_ADDRESS,
      IBT_ABI,
      signer
    );

    const tx = await contract.burn(amount);
    await tx.wait();
    // Aici apelezi backend-ul (bridge.ts) pentru mint pe Sui
  };

  const bridgeToEth = async (amount: string) => {
    // Implementare similară pentru Sui
  };

  return (
    <BridgeContext.Provider value={{ bridgeToSui, bridgeToEth }}>
      {children}
    </BridgeContext.Provider>
  );
}
