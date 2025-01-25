import { BridgeProvider } from "@/context/BridgeContext";
import { networkConfig } from "@/lib/wallet";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { CrossChainBridge } from "../../../bridge/src/bridge";
import BridgeForm from "./components/BridgeForm";
import { ConnectButton } from "./components/ConnectButton";
import { SuiConnectButton } from "./components/SuiConnectButton";
import { bridgeConfig } from "./config";

const queryClient = new QueryClient();

export default function App() {
  // 1. Inițializare bridge
  useEffect(() => {
    const bridge = new CrossChainBridge(bridgeConfig);
    bridge.start();

    return () => {
      bridge.stop();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="localnet">
        <WalletProvider>
          <BridgeProvider>
            <div className="app-container">
              <header className="app-header">
                <h1>Blockchain Bridge</h1>
                <div className="wallet-connectors">
                  <ConnectButton />
                  <SuiConnectButton />
                </div>
              </header>
              <BridgeForm />
            </div>
          </BridgeProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
