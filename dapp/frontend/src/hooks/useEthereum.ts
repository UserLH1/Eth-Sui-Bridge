import { injected } from "@wagmi/connectors";
import { createConnector } from "@wagmi/core";
import { useAccount, useConnect } from "wagmi";

// Crează connector-ul o singură dată în afara hook-ului
const metamaskConnector = createConnector(injected());

export function useEthereum() {
  const { connectAsync } = useConnect();
  const { address, isConnected } = useAccount();

  const connectMetaMask = async () => {
    if (!window.ethereum) throw new Error("Install MetaMask!");

    // Folosește connector-ul creat mai sus
    await connectAsync({ connector: metamaskConnector });
  };

  return { ethAddress: address, isEthConnected: isConnected, connectMetaMask };
}
