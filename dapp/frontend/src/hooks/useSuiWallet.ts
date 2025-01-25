// src/hooks/useSuiWallet.ts
import {
  useAccounts,
  useCurrentAccount,
  useDisconnectWallet,
  useSuiClient,
  useSwitchAccount,
} from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
export function useSuiWallet() {
  // 1. Hook-uri din dapp-kit
  const accounts = useAccounts();
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: disconnect } = useDisconnectWallet();
  const { mutate: switchAccount } = useSwitchAccount();

  // 2. State-uri locale
  const [suiAddress, setSuiAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 3. Configurare contract (schimbă în .env)
  const ibtCoin = import.meta.env.VITE_SUI_CONTRACT_ADDRESS;
  // 4. Formatează balance-ul
  const formatBalance = (balance: string | number): number =>
    Number(balance) / 1e6;

  // 5. Fetch balance logic
  const fetchBalance = async (address: string) => {
    try {
      const balanceResponse = await suiClient.getBalance({
        owner: address,
        coinType: ibtCoin,
      });

      const totalBalance = formatBalance(balanceResponse.totalBalance);
      setBalance(totalBalance);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  // 6. Refresh handler
  const handleRefresh = async () => {
    if (suiAddress) {
      setIsRefreshing(true);
      await fetchBalance(suiAddress);
      setIsRefreshing(false);
    }
  };

  // 7. Efect pentru actualizare automată
  useEffect(() => {
    if (currentAccount?.address) {
      setSuiAddress(currentAccount.address);
      fetchBalance(currentAccount.address);
    }
  }, [currentAccount]);

  // 8. Schimbare cont
  const handleAccountChange = (accountAddress: string) => {
    const selectedAccount = accounts.find(
      (acc: any) => acc.address === accountAddress
    );
    if (selectedAccount) switchAccount({ account: selectedAccount });
  };

  return {
    // Stare
    isConnected: !!currentAccount,
    suiAddress,
    balance,
    accounts,
    currentAccount,

    // Metode
    disconnect,
    handleAccountChange,
    handleRefresh,
    isRefreshing,
  };
}
