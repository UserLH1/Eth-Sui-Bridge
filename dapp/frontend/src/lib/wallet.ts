import {
  SuiClientProvider,
  useSuiClient,
  WalletProvider,
} from "@mysten/dapp-kit";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

// Configurare rețele Sui (hardcodat)
export const networkConfig = {
  localnet: {
    url: "http://localhost:9000", // URL pentru Sui localnet
    websocketUrl: "ws://localhost:9001", // WebSocket pentru Sui localnet
  },
  devnet: {
    url: "https://fullnode.devnet.sui.io:443", // URL pentru Sui devnet
    websocketUrl: "wss://fullnode.devnet.sui.io:443", // WebSocket pentru Sui devnet
  },
};

// Elimină SuiClient și folosește useSuiClient
export function useSui() {
  const suiClient = useSuiClient(); // Folosește hook-ul useSuiClient
  return suiClient;
}

// Export tipuri necesare
export type { SuiClientProvider, WalletProvider };

// Restul codului tău existent...
declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useWallet() {
  const [address, setAddress] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  // Verifică conexiunea existentă la încărcare
  useEffect(() => {
    const checkConnected = async () => {
      if (window.ethereum?.selectedAddress) {
        await connectMetaMask();
      }
    };
    checkConnected();
  }, []);

  // Ascultă schimbări de cont și rețea
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setAddress(accounts[0]);
      } else {
        resetState();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  const checkNetwork = async () => {
    if (!provider) return;

    const network = await provider.getNetwork();
    if (network.chainId !== 31337n) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x7a69" }],
      });
    }
  };

  const connectMetaMask = async () => {
    try {
      if (!window.ethereum) {
        alert("Vă rugăm să instalați MetaMask!");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const newProvider = new ethers.BrowserProvider(window.ethereum!, {
        ensAddress: undefined, // Dezactivează ENS
        chainId: 31337, // Forțează chain ID
      });
      const newSigner = await newProvider.getSigner();

      await checkNetwork();

      const balance = await newProvider.getBalance(accounts[0]);

      setProvider(newProvider);
      setSigner(newSigner);
      setAddress(accounts[0]);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error("Eroare conectare:", error);
      if (error.code === 4001) {
        alert("Ați refuzat conexiunea!");
      }
    }
  };

  const resetState = () => {
    setAddress("");
    setBalance("");
    setProvider(null);
    setSigner(null);
  };

  return {
    address,
    balance,
    provider,
    signer,
    connectMetaMask,
    isConnected: !!address,
  };
}

// Utilitar pentru interacțiune cu contractul
export async function getIBTBalance(
  signer: ethers.Signer,
  contractAddress: string
) {
  const ibtAbi = [
    "function balanceOf(address owner) view returns (uint256)",
    "function mint(address to, uint256 amount)",
    "function burn(uint256 amount)",
  ];

  try {
    const contract = new ethers.Contract(contractAddress, ibtAbi, signer);
    const balance = await contract.balanceOf(await signer.getAddress());
    return ethers.formatUnits(balance, 18);
  } catch (error) {
    console.error("Eroare contract:", error);
    return "0";
  }
}
