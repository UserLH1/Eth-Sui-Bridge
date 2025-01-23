import BridgeForm from "@/components/BridgeForm";
import { BridgeProvider } from "@/context/BridgeContext";
import { networkConfig } from "@/lib/wallet";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="localnet">
        <WalletProvider>
          <BridgeProvider>
            <div
              style={{
                minHeight: "100vh",
                padding: "2rem",
                backgroundColor: "#e2e8f0",
              }}
            >
              <BridgeForm />
            </div>
          </BridgeProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
