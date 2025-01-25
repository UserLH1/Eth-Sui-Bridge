import { useState } from "react";

export function useEthereum() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>();

  const addAnvilNetwork = async () => {
    console.groupCollapsed("[addAnvilNetwork] Început adăugare rețea...");
    try {
      console.log("[addAnvilNetwork] Trimitem cererea wallet_addEthereumChain");
      const result = await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x7a69",
            chainName: "Anvil Local",
            nativeCurrency: {
              name: "ETH",
              symbol: "ETH",
              decimals: 18,
            },
            rpcUrls: ["http://localhost:8545"],
            blockExplorerUrls: [],
          },
        ],
      });
      console.log("[addAnvilNetwork] Rețea adăugată cu succes:", result);
      return true;
    } catch (addError) {
      console.error("[addAnvilNetwork] Eroare adăugare rețea:", {
        name: addError.name,
        message: addError.message,
        code: addError.code,
        stack: addError.stack,
      });
      throw new Error("Nu s-a putut adăuga rețeaua Anvil");
    } finally {
      console.groupEnd();
    }
  };

  const connectMetaMask = async () => {
    console.groupCollapsed("[connectMetaMask] Început proces conectare");
    try {
      console.log("[1] Verificăm existența window.ethereum");
      if (!window.ethereum) {
        console.error("[1] window.ethereum nedetectat");
        throw new Error("Vă rugăm să instalați MetaMask!");
      }

      console.log("[2] Începem verificarea rețelei...");
      let chainId;
      try {
        console.log("[2a] Cerem chainId prin eth_chainId");
        chainId = await window.ethereum.request({ method: "eth_chainId" });
        console.log("[2b] Chain ID primit:", chainId);
      } catch (error) {
        console.error("[2c] Eroare la obținerea chainId:", {
          name: error.name,
          message: error.message,
          code: error.code,
        });
        throw new Error("Nu pot verifica rețeaua");
      }

      console.log("[3] Comparăm chainId (actual vs așteptat)");
      console.table({
        "Chain ID curent": chainId,
        "Chain ID așteptat": "0x7a69",
      });

      if (chainId !== "0x7a69") {
        console.log("[4] Începem schimbarea rețelei...");
        try {
          console.log("[4a] Trimitem wallet_switchEthereumChain");
          const switchResult = await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x7a69" }],
          });
          console.log("[4b] Rețea schimbată cu succes:", switchResult);
        } catch (switchError) {
          console.error("[4c] Eroare schimbare rețea:", {
            name: switchError.name,
            message: switchError.message,
            code: switchError.code,
          });

          if (switchError.code === 4902) {
            console.log("[4d] Începem adăugarea rețelei...");
            const addResult = await addAnvilNetwork();
            console.log("[4e] Rețea adăugată:", addResult);
          } else {
            throw switchError;
          }
        }
      }

      console.log("[5] Începem cererea de conturi...");
      try {
        console.log("[5a] Trimitem eth_requestAccounts");
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("[5b] Conturi primite:", accounts);

        if (!accounts || accounts.length === 0) {
          console.error("[5c] Niciun cont returnat");
          throw new Error("Nu s-au găsit conturi");
        }

        console.log("[5d] Actualizăm starea cu contul primit");
        setIsConnected(true);
        setAddress(accounts[0]);
      } catch (accountsError) {
        console.error("[5e] Eroare la obținerea conturilor:", {
          name: accountsError.name,
          message: accountsError.message,
          code: accountsError.code,
        });
        throw accountsError;
      }

      console.log("[6] Adăugăm ascultători pentru evenimente...");
      const handleAccountsChanged = (newAccounts: string[]) => {
        console.log("[6a] Eveniment accountsChanged:", newAccounts);
        setAddress(newAccounts[0] || "");
        setIsConnected(!!newAccounts[0]);
      };

      const handleChainChanged = (newChainId: string) => {
        console.log("[6b] Eveniment chainChanged:", newChainId);
        if (newChainId !== "0x7a69") {
          console.warn("[6c] Rețea incorectă detectată");
          alert("Vă rugăm să vă întoarceți la rețeaua Anvil!");
          window.location.reload();
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      console.log("[7] Returnăm funcție de cleanup");
      return () => {
        console.log("[7a] Eliminăm ascultătorii");
        window.ethereum?.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum?.removeListener("chainChanged", handleChainChanged);
      };
    } catch (error) {
      console.groupCollapsed("[connectMetaMask] Eroare finală");
      console.error("Detalii complete:", {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack,
      });

      if (error.code === 4001) {
        console.log("[Eroare 4001] Utilizatorul a anulat");
        alert("Ați anulat conectarea!");
      } else if (error.message.includes("adăugați rețeaua")) {
        console.log("[Eroare 4902] Rețea inexistentă");
        alert("Vă rugăm să adăugați rețeaua Anvil în MetaMask!");
      } else {
        console.error("[Eroare necunoscută]", error);
        alert(`Eroare de conectare: ${error.message}`);
      }

      console.log("[Resetare stare]");
      setIsConnected(false);
      setAddress(undefined);
      console.groupEnd();
      throw error;
    } finally {
      console.groupEnd();
    }
  };

  return { isConnected, address, connectMetaMask };
}
