# Stellar DEX Workshop - Soroban Smart Contracts

Full-stack DeFi Decentralized Exchange (DEX) built on Stellar using Soroban smart contracts.

**Project Lead:** Nur Wahid Azhar – nur.wahid.azhar@gmail.com

## 🎯 Project Overview

This project provides a complete DeFi DEX implementation on Stellar's Soroban platform, including:
- **Smart Contracts**: Token, Faucet, Factory, and Pool (AMM) contracts written in Rust
- **Frontend**: React + Vite + Tailwind CSS dashboard for interacting with the contracts
- **Wallet Integration**: Freighter wallet support for transaction signing

## 📁 Project Structure

```
stellar-workshop-starter/
├── contracts/
│   ├── token/          # SEP-41 Token contract
│   ├── faucet/         # Unlimited minting faucet
│   ├── factory/        # Pool factory contract
│   ├── pool/           # AMM Pool with x*y=k
│   └── notes/          # Example contract
├── frontend/
│   ├── src/
│   │   ├── App.tsx     # Main application
│   │   ├── index.css   # Tailwind styles
│   │   └── main.tsx    # Entry point
│   ├── package.json
│   └── dist/           # Production build
├── Cargo.toml          # Rust workspace config
├── README.md           # This file
└── e2e-plan-*.md       # Development plans
```

## 🚀 Features

### Smart Contracts
| Contract | Features |
|----------|----------|
| **Token** | `initialize`, `mint`, `transfer`, `balance_of`, `total_supply` |
| **Faucet** | `initialize`, `faucet` (unlimited minting) |
| **Factory** | `initialize`, `create_pool`, `get_pool`, `get_all_pools` |
| **Pool** | `initialize`, `add_liquidity`, `remove_liquidity`, `swap`, LP tracking |

### Frontend Pages
- **Home** - Dashboard with TVL, trades, and pools stats
- **Swap** - Token swap with AMM pricing (0.25% fee)
- **Liquidity** - Add/remove liquidity management
- **Faucet** - Test token minting
- **Portfolio** - View balances and LP positions
- **History** - Transaction history

## 📋 Prerequisites

### For Smart Contracts
- Rust >= 1.70
- Soroban CLI
- wasm32-unknown-unknown target

### For Frontend
- Node.js >= 18.x
- npm or pnpm

### Wallet
- Freighter Wallet (browser extension)

## 🛠️ Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd stellar-workshop-starter
```

### 2. Setup Smart Contracts
```bash
# Install Rust target for WebAssembly
rustup target add wasm32-unknown-unknown

# Build contracts
cargo build --release --target wasm32-unknown-unknown

# Run tests
cargo test
```

### 3. Setup Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔧 Development

### Smart Contracts

#### Build All Contracts
```bash
cargo build --release --target wasm32-unknown-unknown
```

#### Run Tests
```bash
cargo test
```

#### Deploy Contract (Testnet)
```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/<contract>.wasm \
  --source <your-key> \
  --network testnet
```

### Frontend

#### Development Mode
```bash
cd frontend
npm run dev
# Opens at http://localhost:3000
```

#### Production Build
```bash
cd frontend
npm run build
# Output in dist/
```

## 🔐 Network Configuration

### Testnet
- **RPC URL**: `https://rpc-testnet.stellar.org`
- **Network Passphrase**: `Test SDF Network ; September 2015`
- **Explorer**: https://stellar.expert/explorer/testnet

### Update Contract Addresses
After deploying contracts, update addresses in `frontend/src/App.tsx`:
```typescript
const CONTRACTS = {
  TOKEN: "YOUR_TOKEN_ADDRESS",
  FAUCET: "YOUR_FAUCET_ADDRESS",
  FACTORY: "YOUR_FACTORY_ADDRESS",
  POOL: "YOUR_POOL_ADDRESS",
};
```

## 📊 AMM Mechanics

### Swap Formula
```
amount_out = (amount_in * 9975 * reserve_out) / (reserve_in * 10000 + amount_in * 9975)
```
- **Fee**: 0.25% (9975/10000)
- **Invariant**: x * y = k

### Liquidity Shares
- **First deposit**: LP = min(amount_a, amount_b)
- **Subsequent**: LP = min((amount_a * total_lp) / reserve_a, (amount_b * total_lp) / reserve_b)

## 🔒 Security Considerations

### Smart Contracts
- ✅ `require_auth()` for sensitive operations
- ✅ Reentrancy protection (Soroban design)
- ✅ Input validation
- ⚠️ POC level - not production ready

### Frontend
- ✅ Wallet connection validation
- ✅ Transaction simulation before signing
- ⚠️ Add proper error handling
- ⚠️ Implement slippage protection
- ⚠️ Add transaction notifications

## 🧪 Testing

### Contract Tests
```bash
# Run all tests
cargo test

# Run specific contract tests
cargo test -p token
cargo test -p pool
```

### Test Coverage
- Token: initialize, mint, transfer, balance_of
- Pool: initialize, add_liquidity, swap, remove_liquidity
- Factory: initialize, create_pool
- Faucet: initialize

## 📝 Deployment Checklist

1. **Smart Contracts**
   - [ ] Build all contracts
   - [ ] Run all tests
   - [ ] Deploy Token contract
   - [ ] Deploy Faucet contract
   - [ ] Deploy Factory contract
   - [ ] Create initial pool via Factory
   - [ ] Update frontend with contract addresses

2. **Frontend**
   - [ ] Update contract addresses
   - [ ] Build production bundle
   - [ ] Deploy to hosting (Vercel, Netlify, etc.)
   - [ ] Test wallet connection
   - [ ] Test all features on testnet

## 🤝 Contributing

1. Follow Rust/TypeScript code conventions
2. Write tests for new features
3. Run `cargo test` and `npm run build` before PR
4. Describe **why** in PR, not just **what**

## 📞 Contact

- **Nur Wahid Azhar** – nur.wahid.azhar@gmail.com
- For questions, please reach out via email

## 📄 License

To be determined - TBD

## 🎓 Learning Resources

- [Soroban Documentation](https://soroban.stellar.org/docs)
- [Stellar Developer Portal](https://developers.stellar.org/)
- [Freighter Wallet](https://www.freighter.app/)
- [Rust Programming](https://www.rust-lang.org/learn)

---

**Built with ❤️ on Stellar Soroban**
