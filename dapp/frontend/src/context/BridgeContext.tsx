import { createContext, useContext, useEffect, useState } from "react";
import { CrossChainBridge } from "../../../../bridge/src/bridge";
import { bridgeConfig } from "../config";

type BridgeContextType = {
  bridge?: CrossChainBridge;
  isBridgeReady: boolean;
  bridgeError?: string;
  ethToSui: (amount: string) => Promise<void>;
  suiToEth: (amount: string) => Promise<void>;
};

const BridgeContext = createContext<BridgeContextType>({} as BridgeContextType);

export function BridgeProvider({ children }: { children: React.ReactNode }) {
  const [bridge, setBridge] = useState<CrossChainBridge>();
  const [isBridgeReady, setIsBridgeReady] = useState(false);
  const [bridgeError, setBridgeError] = useState<string>();

  // Inițializare bridge
  useEffect(() => {
    const initBridge = async () => {
      try {
        const bridgeInstance = new CrossChainBridge(bridgeConfig);
        await bridgeInstance.start();
        setBridge(bridgeInstance);
        setIsBridgeReady(true);
        setBridgeError(undefined);
      } catch (error) {
        console.error("Failed to initialize bridge:", error);
        setBridgeError(
          "Failed to initialize bridge. Please check your configuration."
        );
        setIsBridgeReady(false);
      }
    };

    initBridge();

    return () => {
      bridge?.stop();
    };
  }, []);

  // Funcție pentru transfer ETH → SUI
  const ethToSui = async (amount: string) => {
    if (!bridge || !isBridgeReady) {
      throw new Error("Bridge is not ready");
    }

    try {
      console.log(`Initiating ETH → SUI transfer: ${amount} ITB`);
      // Implementează logica de burn pe Ethereum
      // Apoi declanșează mint pe Sui
    } catch (error) {
      console.error("ETH → SUI transfer failed:", error);
      throw error;
    }
  };

  // Funcție pentru transfer SUI → ETH
  const suiToEth = async (amount: string) => {
    if (!bridge || !isBridgeReady) {
      throw new Error("Bridge is not ready");
    }

    try {
      console.log(`Initiating SUI → ETH transfer: ${amount} ITB`);
      // Implementează logica de burn pe Sui
      // Apoi declanșează mint pe Ethereum
    } catch (error) {
      console.error("SUI → ETH transfer failed:", error);
      throw error;
    }
  };

  return (
    <BridgeContext.Provider
      value={{
        bridge,
        isBridgeReady,
        bridgeError,
        ethToSui,
        suiToEth,
      }}
    >
      {children}
    </BridgeContext.Provider>
  );
}

export const useBridge = () => useContext(BridgeContext);
