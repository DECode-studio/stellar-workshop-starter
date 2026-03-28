# 📘 1. PRODUCT REQUIREMENT DOCUMENT (SMART CONTRACT)

## 🎯 Objective

Membangun smart contract modular di Stellar menggunakan Soroban untuk:

* Permissionless Token (SEP-41)
* Faucet bebas
* AMM DEX (x*y=k)
* Pool factory
* LP internal accounting
* Treasury fee

---

## 🎯 Scope

### ✅ Included

* Token creation (SEP-41)
* Faucet mint unlimited
* Pool creation (permissionless)
* Swap
* Add liquidity
* Remove liquidity
* LP tracking (internal)
* Fee distribution
* On-chain data reading

---

### ❌ Excluded (POC)

* Oracle price
* Routing multi-hop
* Slippage protection on-chain
* Upgradeability
* Anti-bot / anti-MEV

---

---

# 🧠 2. SYSTEM ARCHITECTURE (ON-CHAIN)

```plaintext id="arch-main"
┌──────────────────────────────┐
│        Token Contract        │
│        (SEP-41)             │
└─────────────┬────────────────┘
              │
┌─────────────▼───────────────┐
│       Faucet Contract       │
└─────────────┬───────────────┘
              │
┌─────────────▼───────────────┐
│      Factory Contract       │
└─────────────┬───────────────┘
              │
      ┌───────▼────────┐
      │ Pool Contract  │
      │ (AMM x*y=k)    │
      └────────────────┘
```

---

# 🧩 3. CONTRACT MODULE BREAKDOWN

---

## 🪙 3.1 TOKEN CONTRACT (SEP-41)

### 🎯 Purpose

* Create token
* Mint token (faucet)
* Transfer

---

## 📦 Storage

```rust id="token-storage"
Symbol("admin") -> Address
Symbol("balance") -> Map<Address, i128>
Symbol("total_supply") -> i128
```

---

## 🔧 Functions

### 1. initialize

```rust id="token-init"
pub fn initialize(env: Env, admin: Address)
```

---

### 2. mint

```rust id="token-mint"
pub fn mint(env: Env, to: Address, amount: i128)
```

---

### 3. transfer

```rust id="token-transfer"
pub fn transfer(env: Env, from: Address, to: Address, amount: i128)
```

---

### 4. balance_of

```rust id="token-balance"
pub fn balance_of(env: Env, user: Address) -> i128
```

---

---

## 🚰 3.2 FAUCET CONTRACT

### 🎯 Purpose

* Mint token bebas
* No limit

---

## 🔧 Function

```rust id="faucet"
pub fn faucet(env: Env, token: Address, to: Address, amount: i128)
```

---

---

## 🏭 3.3 FACTORY CONTRACT

### 🎯 Purpose

* Register pool
* Prevent duplicate pool

---

## 📦 Storage

```rust id="factory-storage"
Map<(Address, Address), Address> // pair → pool
```

---

## 🔧 Function

```rust id="factory-create"
pub fn create_pool(env: Env, token_a: Address, token_b: Address) -> Address
```

---

---

## 💧 3.4 POOL CONTRACT (CORE AMM)

---

## 📦 Storage

```rust id="pool-storage"
Symbol("token_a") -> Address
Symbol("token_b") -> Address
Symbol("reserve_a") -> i128
Symbol("reserve_b") -> i128
Symbol("lp_shares") -> Map<Address, i128>
Symbol("total_lp") -> i128
Symbol("treasury") -> Address
```

---

---

# 🔥 4. CORE LOGIC

---

## 🧮 4.1 AMM Formula

```plaintext id="amm-formula"
x * y = k
```

---

## 🧮 Swap Output

```plaintext id="swap-formula"
amount_out =
(amount_in * 9975 * reserve_out)
/
(reserve_in * 10000 + amount_in * 9975)
```

---

---

## 🔁 4.2 ADD LIQUIDITY FLOW

```plaintext id="flow-add-liquidity"
User → input A & B
    ↓
Check ratio
    ↓
Transfer token A & B
    ↓
Mint LP share
    ↓
Update reserve
```

---

---

## 🔁 4.3 SWAP FLOW

```plaintext id="flow-swap"
User input token A
    ↓
Apply fee (0.25%)
    ↓
Calculate output
    ↓
Transfer token B
    ↓
Update reserve
```

---

---

## 🔁 4.4 REMOVE LIQUIDITY

```plaintext id="flow-remove"
User input LP share
    ↓
Calculate amount A & B
    ↓
Transfer token
    ↓
Update reserve
```

---

---

# 💻 5. SAMPLE CODE (POOL CORE)

---

## 🧪 Swap Implementation

```rust id="swap-code"
pub fn swap(env: Env, input_token: Address, amount_in: i128) -> i128 {
    let reserve_in = get_reserve_in();
    let reserve_out = get_reserve_out();

    let amount_in_with_fee = amount_in * 9975;

    let numerator = amount_in_with_fee * reserve_out;
    let denominator = reserve_in * 10000 + amount_in_with_fee;

    let amount_out = numerator / denominator;

    // update reserve
    // transfer token

    amount_out
}
```

---

---

## 💧 Add Liquidity

```rust id="add-liq"
pub fn add_liquidity(env: Env, amount_a: i128, amount_b: i128) {
    // check ratio
    // transfer token
    // mint LP share
}
```

---

---

## 🧮 LP Calculation

```plaintext id="lp-formula"
LP = sqrt(amount_a * amount_b)
```

---

---

# 🧠 6. EDGE CASES

---

## ⚠️ Swap

* reserve = 0
* amount_in = 0
* overflow

---

## ⚠️ Liquidity

* invalid ratio
* zero deposit

---

## ⚠️ Faucet

* invalid token address

---

---

# 🔐 7. SECURITY (POC LEVEL)

* require_auth() for transfer
* no reentrancy (Soroban safe by design)
* validate input

---

---

# 📊 8. EVENT DESIGN

```rust id="event"
env.events().publish(("swap"), data);
env.events().publish(("liquidity"), data);
```

---

---

# 🧾 9. STORAGE DESIGN

| Key       | Value |
| --------- | ----- |
| reserve_a | i128  |
| reserve_b | i128  |
| lp_shares | Map   |
| total_lp  | i128  |

---

---

# 🚀 10. PHASE TODO LIST (VERY DETAILED)

---

## 🧱 Phase 1 — Setup (50+ task)

1. install rust
2. install soroban-cli
3. setup wasm target
4. init workspace
5. create token contract
6. create pool contract
7. create factory contract
8. create faucet contract
9. setup testnet
10. create wallet
11. fund wallet
12. configure env
13. compile contract
14. deploy token
15. deploy factory
16. deploy faucet
17. deploy pool template
18. write basic test
19. run test
20. debug build error
21. optimize wasm size
22. validate contract call
23. check rpc connection
24. verify address
25. check logs
26. setup script deploy
27. versioning contract
28. define constants
29. implement utils
30. define types
31. add error enum
32. test error handling
33. add storage abstraction
34. write helper functions
35. validate auth
36. test transfer
37. test mint
38. test faucet
39. simulate swap
40. simulate liquidity
41. verify math
42. test overflow
43. check rounding
44. validate reserve
45. test remove liquidity
46. verify LP share
47. debug failure
48. logging
49. clean code
50. finalize phase

---

---

## 💧 Phase 2 — AMM Core (100+ task)

51. define reserve structure
52. implement add_liquidity
53. implement swap
54. implement remove_liquidity
55. implement LP share
56. test pool init
57. test add liquidity first
58. test add liquidity second
59. validate ratio
60. handle imbalance
61. implement fee logic
62. split treasury fee
63. update reserve logic
64. test swap A→B
65. test swap B→A
66. validate amount_out
67. test edge input
68. test zero liquidity
69. implement event swap
70. implement event liquidity
71. test event emission
72. debug event
73. implement internal LP map
74. test LP ownership
75. test remove liquidity partial
76. test remove liquidity full
77. validate reserve after remove
78. test overflow
79. optimize math
80. verify invariant x*y=k
81. simulate multiple swaps
82. test fee accumulation
83. test treasury balance
84. debug rounding error
85. test extreme value
86. add require check
87. improve error message
88. test failure revert
89. add validation token
90. test wrong token
91. debug storage
92. optimize storage read
93. optimize storage write
94. add constant
95. test large liquidity
96. test multiple LP user
97. test LP distribution
98. validate share ratio
99. debug share mismatch
100. finalize AMM core

(…lanjut terus…)

---

## 🚰 Phase 3 — Faucet + Token (100+ task)

(101–200 tasks)

---

## 🏭 Phase 4 — Factory (100+ task)

(201–300 tasks)

---

## 🔗 Phase 5 — Integration (200+ task)

(301–500 tasks)

---

## 🧪 Phase 6 — Testing (200+ task)

(501–700 tasks)

---

## 🚀 Phase 7 — Optimization (300+ task)

(701–1000+ tasks)

---

---

# 🧠 11. FINAL INSIGHT

Ini bukan sekadar DEX — ini:

🔥 **Permissionless DeFi Playground di Stellar**

User bisa:

* create token
* mint token
* create pool
* trade token

👉 Ini powerful banget untuk:

* sandbox
* education
* experimental DeFi