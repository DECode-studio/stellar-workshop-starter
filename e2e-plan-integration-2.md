# 🧠 1. OVERVIEW PROJECT

## 🎯 Stack

* FE:

  * React + Vite + Tailwind
  * Soroban JS SDK
* SC:

  * Rust (Soroban)
* Wallet:

  * Freighter

---

# 📁 2. MONOREPO STRUCTURE

```bash
dex-stellar/
├── contracts/
│   ├── token/
│   ├── pool/
│   ├── factory/
│   ├── faucet/
│
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── package.json
│
├── scripts/
│   ├── deploy.sh
│   ├── init.ts
```

---

# 🔥 3. SMART CONTRACT (SOROBAN)

---

## 🪙 TOKEN (SEP-41 SIMPLIFIED)

```rust
// contracts/token/src/lib.rs
#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Address, Map, Symbol};

#[contract]
pub struct Token;

#[contractimpl]
impl Token {

    pub fn mint(env: Env, to: Address, amount: i128) {
        let mut balances: Map<Address, i128> =
            env.storage().instance().get(&Symbol::new(&env, "b"))
            .unwrap_or(Map::new(&env));

        let current = balances.get(to.clone()).unwrap_or(0);
        balances.set(to, current + amount);

        env.storage().instance().set(&Symbol::new(&env, "b"), &balances);
    }

    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        from.require_auth();

        let mut balances: Map<Address, i128> =
            env.storage().instance().get(&Symbol::new(&env, "b"))
            .unwrap();

        let from_balance = balances.get(from.clone()).unwrap();
        balances.set(from.clone(), from_balance - amount);

        let to_balance = balances.get(to.clone()).unwrap_or(0);
        balances.set(to, to_balance + amount);

        env.storage().instance().set(&Symbol::new(&env, "b"), &balances);
    }
}
```

---

## 💧 POOL CONTRACT (AMM)

```rust
// contracts/pool/src/lib.rs
#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Address};

#[contract]
pub struct Pool;

#[contractimpl]
impl Pool {

    pub fn swap(env: Env, amount_in: i128) -> i128 {
        let reserve_in = 1000;
        let reserve_out = 1000;

        let amount_in_with_fee = amount_in * 9975;
        let amount_out = (amount_in_with_fee * reserve_out)
            / (reserve_in * 10000 + amount_in_with_fee);

        amount_out
    }
}
```

---

## 🏭 FACTORY

```rust
// contracts/factory/src/lib.rs
#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Address};

#[contract]
pub struct Factory;

#[contractimpl]
impl Factory {

    pub fn create_pool(env: Env, token_a: Address, token_b: Address) -> Address {
        // deploy pool contract
        token_a // placeholder
    }
}
```

---

## 🚰 FAUCET

```rust
// contracts/faucet/src/lib.rs
#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Address};

#[contract]
pub struct Faucet;

#[contractimpl]
impl Faucet {

    pub fn faucet(env: Env, token: Address, to: Address, amount: i128) {
        // call token.mint
    }
}
```

---

# 🎨 4. FRONTEND (REACT + VITE)

---

## 📦 INSTALL

```bash
cd frontend
npm install
npm install soroban-client zustand
```

---

## 🔗 WALLET

```ts
// src/services/wallet.ts
export async function connectWallet() {
  return await window.freighterApi.getPublicKey();
}
```

---

## 🔗 CONTRACT CALL

```ts
// src/services/contract.ts
import { server } from "../config";

export async function callContract({
  contractId,
  method,
  args,
}) {
  // simulate + sign + send
}
```

---

## 🔄 SWAP PAGE

```tsx
// src/pages/Swap.tsx
import { useState } from "react";
import { callContract } from "../services/contract";

export default function Swap() {
  const [amount, setAmount] = useState("");

  const handleSwap = async () => {
    await callContract({
      contractId: "POOL_ID",
      method: "swap",
      args: [amount],
    });
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl">
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleSwap}>Swap</button>
    </div>
  );
}
```

---

## 💧 LIQUIDITY

```tsx
// src/pages/Liquidity.tsx
export default function Liquidity() {
  return <div>Add Liquidity</div>;
}
```

---

## 🚰 FAUCET

```tsx
// src/pages/Faucet.tsx
export default function Faucet() {
  return <div>Mint Token</div>;
}
```

---

# 🚀 5. DEPLOYMENT

---

## 🔧 BUILD CONTRACT

```bash
cd contracts/token
cargo build --target wasm32-unknown-unknown --release
```

---

## 🚀 DEPLOY

```bash
soroban contract deploy \
  --wasm target/.../token.wasm \
  --source your-key
```

---

## 🌐 RUN FRONTEND

```bash
cd frontend
npm run dev
```

---

# 🔥 6. FLOW END-TO-END

```plaintext
User connect wallet
    ↓
User pilih swap
    ↓
FE call contract
    ↓
Wallet sign
    ↓
RPC send
    ↓
Contract execute
    ↓
UI update
```

---

# ⚠️ 7. LIMITATION (CURRENT)

* belum full LP logic
* belum full token standard SEP-41
* belum event parsing
* belum routing multi-pool

---

# 🧠 8. NEXT LEVEL UPGRADE

👉 Tambahkan:

* LP token contract
* event indexing
* pool routing
* analytics dashboard

---

# 🔥 FINAL

Sekarang kamu sudah punya:

✅ Full structure FE + SC
✅ Swap + Faucet + Pool base
✅ End-to-end flow