# 🔥 1. END-TO-END ARCHITECTURE

```plaintext
[React FE (Vite + Tailwind)]
        ↓
Wallet (Freighter / Stellar Wallet)
        ↓ sign tx
Soroban Client (JS SDK)
        ↓
RPC (Testnet)
        ↓
Smart Contract (Token / Pool / Faucet / Factory)
```

---

# 🧠 2. FLOW GLOBAL (REAL USER JOURNEY)

```plaintext
User connect wallet
    ↓
User pilih fitur (Swap / Faucet / LP)
    ↓
FE fetch state dari contract
    ↓
User input action
    ↓
FE simulate tx
    ↓
User sign via wallet
    ↓
Send tx → Soroban RPC
    ↓
Wait confirm
    ↓
Update UI state
```

---

# ⚙️ 3. SETUP ENV (WAJIB)

## Install SDK

```bash
npm install soroban-client
```

---

## Config

```ts
// src/config/soroban.ts
import { Server } from "soroban-client";

export const server = new Server(
  "https://rpc-testnet.stellar.org"
);

export const NETWORK_PASSPHRASE =
  "Test SDF Network ; September 2015";
```

---

# 🔗 4. WALLET SIGNING (FREIGHTER)

Gunakan Freighter

```ts
// src/services/wallet.ts
export async function getPublicKey() {
  return await window.freighterApi.getPublicKey();
}
```

---

# 🧩 5. CONTRACT CALL LAYER (CORE)

Ini paling penting 👇

```ts
// src/services/contract.ts
import {
  TransactionBuilder,
  Networks,
  BASE_FEE,
  xdr,
} from "soroban-client";

import { server } from "../config/soroban";
import { getPublicKey } from "./wallet";

export async function callContract({
  contractId,
  method,
  args,
}) {
  const account = await server.getAccount(
    await getPublicKey()
  );

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      xdr.Operation.invokeHostFunction({
        func: xdr.HostFunction.hostFunctionTypeInvokeContract(),
        parameters: [
          contractId,
          method,
          ...args,
        ],
      })
    )
    .setTimeout(30)
    .build();

  // simulate
  const sim = await server.simulateTransaction(tx);

  // sign
  const signed =
    await window.freighterApi.signTransaction(
      tx.toXDR(),
      { network: "TESTNET" }
    );

  // send
  const result = await server.sendTransaction(
    TransactionBuilder.fromXDR(
      signed,
      Networks.TESTNET
    )
  );

  return result;
}
```

---

# 🔄 6. IMPLEMENTASI: SWAP (REAL FLOW)

---

## 🧠 Flow

```plaintext
Input amount
    ↓
Fetch reserve
    ↓
Calculate output
    ↓
Call swap()
```

---

## 🧪 Hook Swap

```ts
// src/hooks/useSwap.ts
import { callContract } from "../services/contract";

export function useSwap() {
  const swap = async (
    contractId,
    tokenIn,
    amount
  ) => {
    return await callContract({
      contractId,
      method: "swap",
      args: [tokenIn, amount],
    });
  };

  return { swap };
}
```

---

## 🎨 UI Swap

```tsx
// src/pages/Swap.tsx
import { useState } from "react";
import { useSwap } from "../hooks/useSwap";

export default function Swap() {
  const [amount, setAmount] = useState("");
  const { swap } = useSwap();

  const handleSwap = async () => {
    await swap("POOL_CONTRACT_ID", "TOKEN_A", amount);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl">
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="bg-gray-800 p-2"
      />
      <button onClick={handleSwap}>
        Swap
      </button>
    </div>
  );
}
```

---

# 💧 7. IMPLEMENTASI: ADD LIQUIDITY

```ts
// src/hooks/useLiquidity.ts
export function useLiquidity() {
  const addLiquidity = async (
    contractId,
    amountA,
    amountB
  ) => {
    return await callContract({
      contractId,
      method: "add_liquidity",
      args: [amountA, amountB],
    });
  };

  return { addLiquidity };
}
```

---

# 🚰 8. IMPLEMENTASI: FAUCET

```ts
// src/hooks/useFaucet.ts
export function useFaucet() {
  const faucet = async (
    contractId,
    token,
    amount
  ) => {
    return await callContract({
      contractId,
      method: "faucet",
      args: [token, amount],
    });
  };

  return { faucet };
}
```

---

# 🧠 9. FETCH STATE (READ CONTRACT)

```ts
// src/services/read.ts
export async function readContract(
  contractId,
  method
) {
  // simulate read call
}
```

---

# 🔁 10. STATE REFRESH FLOW

```plaintext
Tx success
   ↓
Refetch:
   - balance
   - reserve
   - LP share
   ↓
Update UI
```

---

# ⚠️ 11. ERROR HANDLING (REAL CASE)

* wallet reject
* tx failed
* insufficient balance
* contract revert

```ts
try {
  await swap();
} catch (e) {
  console.error(e);
}
```

---

# 🔐 12. UX FLOW (SIGNING)

```plaintext
User klik swap
    ↓
Popup wallet muncul
    ↓
User approve
    ↓
Tx dikirim
    ↓
Loading spinner
    ↓
Success / failed
```

---

# 🚀 13. OPTIMIZATION

* debounce input
* cache reserve
* parallel fetch
* optimistic UI

---

# 🧪 14. TEST FLOW

```plaintext
Test swap
Test faucet
Test LP
Test wallet connect
Test error case
```

---

# 🧠 15. FINAL INSIGHT

Ini yang kamu bangun:

🔥 **Fully On-chain DeFi App di Stellar**

Tanpa:

* backend
* indexer
* centralized logic

---

# 🔥 NEXT LEVEL (RECOMMENDED)

Kalau mau naik level:

👉 Tambahkan:

* event listener (real history)
* pool routing
* price chart
* multi-chain (Axelar / CCIP)

---

# 🚀 NEXT STEP

Kalau kamu mau lanjut:

👉 gue bisa generate:

### 💻 FULL PROJECT

* React production ready
* All hooks
* All pages
* Clean architecture

### 🔧 FULL CONTRACT

* token (complete SEP-41)
* pool (complete AMM)
* factory
* faucet