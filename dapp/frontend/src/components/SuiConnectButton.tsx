// src/components/SuiConnectButton.tsx
import { useSuiWallet } from "@/hooks/useSuiWallet";
import { ConnectModal } from "@mysten/dapp-kit";

export function SuiConnectButton() {
  const {
    isConnected,
    suiAddress,
    balance,
    accounts,
    currentAccount,
    disconnect,
    handleAccountChange,
    handleRefresh,
    isRefreshing,
  } = useSuiWallet();

  return (
    <div className="sui-wallet">
      <header>
        <h2>SUI WALLET</h2>
      </header>

      {!isConnected ? (
        <ConnectModal
          trigger={<button className="connect-btn">Connect Wallet</button>}
        />
      ) : (
        <div className="connected-container">
          <div className="account-controls">
            <select
              value={currentAccount?.address || ""}
              onChange={(e) => handleAccountChange(e.target.value)}
              className="account-select"
            >
              {accounts.map((account: any) => (
                <option key={account.address} value={account.address}>
                  {`${account.address.slice(0, 6)}...${account.address.slice(
                    -4
                  )}`}
                </option>
              ))}
            </select>

            <button onClick={() => disconnect()} className="disconnect-btn">
              Disconnect
            </button>
          </div>

          <div className="balance-section">
            <span>Balance: {balance.toFixed(4)} ITB</span>
            <button
              onClick={handleRefresh}
              className={`refresh-btn ${isRefreshing ? "spinning" : ""}`}
            >
              ↻
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
