# 📘 1. PRD FRONTEND (DEX SOROBAN)

## 🎯 Objective

Membangun frontend **DeFi dashboard** yang:

* connect wallet Stellar
* interact dengan Soroban contract
* menampilkan data on-chain real-time
* UX mirip Uniswap (simplified)

---

## 🎯 Core Features

### 🔗 Wallet

* connect/disconnect wallet (Freighter + others)
* detect network (testnet)

---

### 🔄 Swap

* select token A/B
* input amount
* slippage tolerance
* preview output
* execute swap

---

### 💧 Liquidity

* add liquidity
* remove liquidity
* show LP share

---

### 🚰 Faucet

* create token
* mint token
* select existing token

---

### 📊 Portfolio

* balances
* LP share
* token list

---

### 🏭 Pool Explorer

* list pool
* create pool

---

### 📜 Transaction History

* read event Soroban
* show latest tx

---

---

# 🧠 2. FRONTEND ARCHITECTURE

```plaintext id="fe-arch"
UI (React + Tailwind)
    ↓
Hooks Layer
    ↓
Service Layer (Soroban SDK)
    ↓
RPC (Soroban)
    ↓
Smart Contract
```

---

# 🧩 3. FOLDER STRUCTURE

```bash id="fe-structure"
src/
 ├── app/
 ├── components/
 │    ├── ui/
 │    ├── swap/
 │    ├── liquidity/
 │    ├── faucet/
 ├── pages/
 │    ├── Home.tsx
 │    ├── Swap.tsx
 │    ├── Liquidity.tsx
 │    ├── Faucet.tsx
 │    ├── Portfolio.tsx
 │    ├── Admin.tsx
 │    ├── History.tsx
 ├── hooks/
 │    ├── useWallet.ts
 │    ├── useSwap.ts
 │    ├── useLiquidity.ts
 │    ├── useFaucet.ts
 ├── services/
 │    ├── soroban.ts
 │    ├── contracts.ts
 ├── store/
 │    ├── appStore.ts
 ├── utils/
 │    ├── math.ts
 │    ├── format.ts
 ├── constants/
```

---

# 🎨 4. UI DESIGN (Dark DeFi)

![Image](https://tailwindcss.com/_next/static/media/catalyst-components-dark-mode.290d11f3.png)

![Image](https://cdn.dribbble.com/userupload/44306172/file/still-ccc7242618feeda0f22cad9d2b8947c1.png)

![Image](https://market-resized.envatousercontent.com/previews/files/772462857/01_AI_dark.png?cf_fit=crop\&crop=top\&format=auto\&h=300\&q=85\&s=51199e38bf250f35813e923ec0225b60fc34aea8db119151b3b906207d26f5df\&w=590)

![Image](https://cdn.dribbble.com/userupload/46225060/file/a0a1b03b7867788673ed685220209323.png?format=webp\&resize=400x300\&vertical=center)

---

# 🔗 5. WALLET INTEGRATION

## Hook: useWallet

```ts id="wallet-hook"
import { useState } from "react";

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);

  const connect = async () => {
    const res = await window.freighterApi.getPublicKey();
    setAddress(res);
  };

  return { address, connect };
}
```

---

# 🔗 6. SOROBAN SERVICE LAYER

```ts id="soroban-service"
import { Server } from "soroban-client";

const server = new Server("https://rpc-testnet.stellar.org");

export async function callContract(contractId, method, args) {
  // build tx
  // simulate
  // sign
  // send
}
```

---

# 🔄 7. SWAP FLOW (FE LOGIC)

```plaintext id="swap-flow"
User input amount
    ↓
Fetch reserve
    ↓
Calculate output
    ↓
Apply slippage
    ↓
Show preview
    ↓
User confirm
    ↓
Send tx
```

---

## 🧮 Swap Calculation (Frontend)

```ts id="swap-math"
export function getAmountOut(amountIn, reserveIn, reserveOut) {
  const amountInWithFee = amountIn * 9975;
  return (amountInWithFee * reserveOut) /
         (reserveIn * 10000 + amountInWithFee);
}
```

---

---

# 💧 8. LIQUIDITY FLOW

```plaintext id="liq-flow"
User input A & B
    ↓
Check ratio
    ↓
Preview LP share
    ↓
Send tx
```

---

---

# 🚰 9. FAUCET FLOW

```plaintext id="faucet-flow"
Select token / create token
    ↓
Input amount
    ↓
Call faucet()
    ↓
Update balance
```

---

---

# 📊 10. STATE MANAGEMENT

## Store (Zustand)

```ts id="store"
import { create } from "zustand";

export const useAppStore = create((set) => ({
  tokens: [],
  pools: [],
  balances: {},
}));
```

---

---

# 🔥 11. COMPONENT DESIGN

## Swap Component

```tsx id="swap-ui"
function Swap() {
  const [amount, setAmount] = useState("");

  return (
    <div className="bg-gray-900 p-4 rounded-xl">
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button>Swap</button>
    </div>
  );
}
```

---

---

# ⚠️ 12. ERROR HANDLING

* insufficient balance
* tx failed
* slippage exceeded
* wallet not connected

---

---

# 🚀 13. PERFORMANCE

* debounce input
* cache reserve
* avoid re-render
* lazy load pages

---

---

# 🔐 14. SECURITY (FE)

* validate input
* sanitize number
* prevent overflow UI
* show confirmation modal

---

---

# 🧪 15. TEST PLAN

* swap calculation test
* liquidity test
* wallet connect test
* faucet test

---

---

# 📈 16. ANALYTICS (ON-CHAIN)

* total liquidity
* pool size
* volume (optional)

---

---

# 🚀 17. PHASE TODO LIST (1000+ TASKS)

---

## 🧱 Phase 1 — Setup (100 task)

1. init vite
2. install react
3. install tailwind
4. setup dark theme
5. install zustand
6. install soroban sdk
7. setup env
8. create folder structure
9. create pages
10. create layout
11. setup router
12. create navbar
13. create sidebar
14. create theme toggle
15. setup wallet hook
16. test wallet connect
17. debug wallet error
18. add loading state
19. create button UI
20. create input UI
21. create modal
22. create toast
23. setup constants
24. create utils
25. setup formatting
26. create token type
27. create pool type
28. create config
29. create API layer
30. test RPC
31. debug RPC
32. connect contract
33. simulate tx
34. send tx
35. handle error
36. logging
37. cleanup
38. optimize bundle
39. test build
40. deploy FE
41. test deployment
42. fix CSS bug
43. fix responsive
44. test mobile
45. fix layout
46. add skeleton loading
47. add spinner
48. create error boundary
49. test crash
50. finalize phase

---

---

## 🔄 Phase 2 — Swap (150 task)

51. create swap page
52. create token selector
53. fetch tokens
54. display token
55. create input
56. validate input
57. calculate output
58. fetch reserve
59. cache reserve
60. update UI
61. handle slippage
62. add slippage input
63. preview output
64. create confirm modal
65. call swap
66. simulate swap
67. send tx
68. show loading
69. show success
70. show error
71. update balance
72. refetch reserve
73. test swap
74. debug swap
75. optimize swap
    ... (hingga 200+)

---

---

## 💧 Phase 3 — Liquidity (200 task)

(200–400)

---

---

## 🚰 Phase 4 — Faucet (150 task)

(400–550)

---

---

## 📊 Phase 5 — Portfolio (150 task)

(550–700)

---

---

## 🏭 Phase 6 — Pool Explorer (150 task)

(700–850)

---

---

## 📜 Phase 7 — History (150 task)

(850–1000+)

---

---

# 🧠 18. FINAL INSIGHT

Frontend kamu ini akan jadi:

🔥 **Full DeFi Interface di Stellar**

* tanpa backend
* full on-chain
* permissionless