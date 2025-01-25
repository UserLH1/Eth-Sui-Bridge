import { useEthereum } from "../hooks/useEthereum";

export function ConnectButton() {
  const { isConnected, address, connectMetaMask } = useEthereum();
  console.log("isConnected", isConnected);
  console.log("address", address);

  return (
    <div>
      {isConnected ? (
        <div
          style={{
            backgroundColor: "#2ecc71",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          Conectat: {address?.slice(0, 6)}...{address?.slice(-4)}
        </div>
      ) : (
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#e67e22",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={connectMetaMask}
        >
          Conectează MetaMask
        </button>
      )}
    </div>
  );
}
