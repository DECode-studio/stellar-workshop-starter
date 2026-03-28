# Stellar DEX - Project Rename & Documentation

## Project Name Change

**From:** `stellar-workshop-starter`  
**To:** `stellar-dex-soroban`

## Reason for Rename

This project has evolved from a simple workshop starter template into a **complete DeFi DEX implementation** on Stellar Soroban with:

- ✅ 4 Smart Contracts (Token, Faucet, Factory, Pool)
- ✅ Full React Frontend with Dark Theme
- ✅ Testnet Deployments
- ✅ Production-Ready Build

The new name `stellar-dex-soroban` better reflects the project's actual functionality and purpose.

## Rename Instructions

### 1. Rename Directory
```bash
cd /Users/staffinc/Documents/Development/web3/
mv stellar-workshop-starter stellar-dex-soroban
```

### 2. Update Package Names

#### Frontend (`frontend/package.json`)
```json
{
  "name": "stellar-dex-frontend",
  "description": "DeFi DEX Frontend on Stellar Soroban"
}
```

#### Contracts (`Cargo.toml`)
```toml
[workspace]
name = "stellar-dex-contracts"
```

### 3. Update Git Remote (if applicable)
```bash
cd stellar-dex-soroban
git remote set-url origin <new-repo-url>
```

### 4. Update Documentation References

Search and replace in all markdown files:
- `stellar-workshop-starter` → `stellar-dex-soroban`
- `Workshop Starter` → `DEX Soroban`

---

## Project Identity

### Full Name
**Stellar DEX - Soroban AMM**

### Tagline
*Decentralized Exchange powered by Soroban on Stellar*

### Key Features
- 🪙 **Token Contract** - SEP-41 compatible token creation
- 💧 **AMM Pool** - x*y=k automated market maker
- 🏭 **Factory** - Permissionless pool creation
- 🚰 **Faucet** - Test token distribution
- 🎨 **Frontend** - React + Tailwind dark theme UI
- 💼 **Wallet** - Freighter integration

### Target Network
- **Stellar Testnet** (for development)
- **Stellar Mainnet** (for production)

---

## Branding Guidelines

### Logo Concept
```
┌─────────────────┐
│  ⭐ STELLAR    │
│     DEX        │
│  by Soroban    │
└─────────────────┘
```

### Color Scheme
- **Primary**: `#3B82F6` (Blue)
- **Secondary**: `#8B5CF6` (Purple)
- **Dark**: `#0F172A` (Navy)
- **Accent**: `#10B981` (Green)

### Typography
- **Headings**: Bold, Sans-serif
- **Body**: Regular, Sans-serif
- **Code**: Monospace

---

## Repository Structure

```
stellar-dex-soroban/
├── contracts/          # Smart Contracts (Rust)
│   ├── token/         # Token contract
│   ├── faucet/        # Faucet contract
│   ├── factory/       # Factory contract
│   └── pool/          # AMM Pool contract
├── frontend/          # React Frontend
│   ├── src/
│   ├── public/
│   └── dist/         # Production build
├── docs/             # Documentation
├── scripts/          # Deployment scripts
├── README.md         # Main documentation
├── RESULT.md         # Build & Deploy results
└── RENAME.md         # This file
```

---

## Contact & Support

- **Project Lead**: Nur Wahid Azhar
- **Email**: nur.wahid.azhar@gmail.com
- **Documentation**: See README.md
- **Results**: See RESULT.md

---

## License

To be determined - TBD

---

**Last Updated**: March 28, 2026
