```markdown
# Blockchain Bridge Project

## Description

This project implements a bridge between the Sui and Ethereum blockchains, enabling seamless asset transfers and interactions between the two networks. It leverages smart contracts, frontend interfaces, and various blockchain tools to provide a robust and efficient bridge solution.

## Technologies Used

### Backend
- **Sui Blockchain**
    - **Move Language**: For writing smart contracts.
    - **Move.lock**: Dependency management.
- **Ethereum Blockchain**
    - **Solidity**: Smart contract development.
    - **Foundry**: Ethereum development framework.
    - **Forge-Std**: Standard libraries for testing and contract interactions.

### Frontend
- **React**: Frontend library for building user interfaces.
- **TypeScript**: Typed superset of JavaScript.
- **Vite**: Fast frontend build tool.
- **Ethers.js**: Library for interacting with the Ethereum blockchain.

### Tools & Libraries
- **dotenv**: Environment variable management.
- **ESLint**: Code linting for maintaining code quality.
- **SWC**: Super-fast compiler for JavaScript/TypeScript.

## Installation

### Prerequisites
- **Node.js**: Version 16 or higher.
- **npm**: Node package manager.
- **Rust**: Required for Sui and Move development.
- **Foundry**: Ethereum development toolkit.
- **Git**: Version control system.

### Backend Setup

1. **Clone the Repository**
     ```bash
     git clone https://github.com/yourusername/blockchain-bridge.git
     cd blockchain-bridge
     ```

2. **Setup Sui**
     - Install Sui:
         ```bash
         sh -ci "$(curl -fsSL https://raw.githubusercontent.com/MystenLabs/sui/latest/scripts/install.sh)"
         ```
     - Navigate to Sui contracts:
         ```bash
         cd sui-framework/packages/sui-framework
         ```

3. **Setup Ethereum Contracts**
     - Install Foundry:
         ```bash
         curl -L https://foundry.paradigm.xyz | bash
         foundryup
         ```
     - Compile Contracts:
         ```bash
         forge build
         ```

### Frontend Setup

1. **Navigate to Frontend Directory**
     ```bash
     cd dapp/frontend
     ```

2. **Install Dependencies**
     ```bash
     npm install
     ```

3. **Configure Environment Variables**
     - Create a `.env` file based on `.env.example` and set the necessary variables:
         ```env
         VITE_ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
         VITE_ETHEREUM_PRIVATE_KEY=your_private_key
         VITE_SUI_RPC_URL=https://fullnode.devnet.sui.io
         ```

4. **Run the Development Server**
     ```bash
     npm run dev
     ```

### Testing

1. **Run Ethereum Tests**
     ```bash
     forge test
     ```

2. **Run Frontend Tests**
     ```bash
     npm run test
     ```

## Usage

1. **Start Backend Services**
     - Ensure Sui full node and Ethereum node are running.

2. **Interact via Frontend**
     - Access the React frontend at `http://localhost:3000`.
     - Use the interface to bridge assets between Sui and Ethereum.

## Contributing

1. **Fork the Repository**
2. **Create a Feature Branch**
     ```bash
     git checkout -b feature/YourFeature
     ```
3. **Commit Your Changes**
4. **Push to the Branch**
     ```bash
     git push origin feature/YourFeature
     ```
5. **Open a Pull Request**

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
```