// contracts.ts
export const IBT_ABI = [
  // ABI-ul contractului tău Ethereum (IBT.sol)
  "function mint(address to, uint256 amount) external",
  "function burn(uint256 amount) external",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
] as const;

export const SUI_PACKAGE_ID = "0xYOUR_SUI_PACKAGE_ID"; // ID-ul pachetului Sui
export const ETH_CONTRACT_ADDRESS = "0xYOUR_ETHEREUM_CONTRACT_ADDRESS";
