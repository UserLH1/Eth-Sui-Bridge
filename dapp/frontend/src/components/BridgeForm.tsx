import { useState } from "react";
import "../App.css";
function BridgeForm() {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleBridgeToSui = async () => {
    setIsLoading(true);
    try {
      // Aici logica pentru bridge
      console.log(`Bridging ${amount} ETH to SUI`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBridgeToEth = async () => {
    setIsLoading(true);
    try {
      // Aici logica pentru bridge invers
      console.log(`Bridging ${amount} SUI to ETH`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setIsLoading(false);
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
          onClick={handleBridgeToSui}
          disabled={isLoading || !amount}
        >
          ETH → SUI
        </button>

        <button
          className="bridge-button"
          onClick={handleBridgeToEth}
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
