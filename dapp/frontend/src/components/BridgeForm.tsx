import { useBridge } from "@/context/BridgeContext";
import { useEthereum } from "@/hooks/useEthereum";
import { useSuiWallet } from "@/hooks/useSuiWallet";
import { useState } from "react";
import "../App.css";
function BridgeForm() {
  const [amount, setAmount] = useState("");
  const { ethToSui, suiToEth } = useBridge();
  const { isConnected: isEthConnected } = useEthereum();
  const { isConnected: isSuiConnected } = useSuiWallet();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (direction: "eth-sui" | "sui-eth") => {
    try {
      if (direction === "eth-sui") {
        await ethToSui(amount);
      } else {
        await suiToEth(amount);
      }
      alert("Transaction submitted successfully!");
    } catch (error) {
      console.error("Bridge error:", error);
      alert(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  return (
    <div className="bridge-container">
      <input
        type="number"
        className="bridge-input"
        placeholder="Amount to bridge"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <div className="button-group">
        <button
          className="bridge-button"
          onClick={() => handleSubmit("eth-sui")}
          disabled={isLoading || !amount}
        >
          ETH → SUI
        </button>

        <button
          className="bridge-button"
          onClick={() => handleSubmit("sui-eth")}
          disabled={isLoading || !amount}
        >
          SUI → ETH
        </button>
      </div>

      {isLoading && <p className="status-text">Processing transaction...</p>}
    </div>
  );
}

export default BridgeForm;
