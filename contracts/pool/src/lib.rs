#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env, Map, Symbol};

// Storage keys
const KEY_TOKEN_A: Symbol = symbol_short!("TKA");
const KEY_TOKEN_B: Symbol = symbol_short!("TKB");
const KEY_RESERVE_A: Symbol = symbol_short!("RESA");
const KEY_RESERVE_B: Symbol = symbol_short!("RESB");
const KEY_LP_SHARES: Symbol = symbol_short!("LPSHARE");
const KEY_TOTAL_LP: Symbol = symbol_short!("TOTLP");
const KEY_TREASURY: Symbol = symbol_short!("TREAS");

// Fee: 0.25% (9975 / 10000)
const FEE_NUMERATOR: i128 = 9975;
const FEE_DENOMINATOR: i128 = 10000;

#[contract]
pub struct Pool;

#[contractimpl]
impl Pool {
    /// Initialize pool with token addresses and treasury
    pub fn initialize(env: Env, token_a: Address, token_b: Address, treasury: Address) {
        // Prevent re-initialization
        if env.storage().instance().has(&KEY_TOKEN_A) {
            panic!("Pool already initialized");
        }
        
        env.storage().instance().set(&KEY_TOKEN_A, &token_a);
        env.storage().instance().set(&KEY_TOKEN_B, &token_b);
        env.storage().instance().set(&KEY_RESERVE_A, &0i128);
        env.storage().instance().set(&KEY_RESERVE_B, &0i128);
        env.storage().instance().set(&KEY_LP_SHARES, &Map::<Address, i128>::new(&env));
        env.storage().instance().set(&KEY_TOTAL_LP, &0i128);
        env.storage().instance().set(&KEY_TREASURY, &treasury);
        
        // Emit event
        env.events().publish(
            (symbol_short!("pool_init"),),
            (token_a, token_b, treasury),
        );
    }

    /// Add liquidity to the pool
    /// Returns LP shares minted
    pub fn add_liquidity(env: Env, user: Address, amount_a: i128, amount_b: i128) -> i128 {
        user.require_auth();
        
        if amount_a <= 0 || amount_b <= 0 {
            panic!("Amounts must be positive");
        }
        
        let _token_a: Address = env.storage().instance().get(&KEY_TOKEN_A).unwrap();
        let _token_b: Address = env.storage().instance().get(&KEY_TOKEN_B).unwrap();
        
        // Transfer tokens from user to pool
        // Note: In production, use proper token transfer with auth
        
        let reserve_a: i128 = env.storage().instance().get(&KEY_RESERVE_A).unwrap_or(0);
        let reserve_b: i128 = env.storage().instance().get(&KEY_RESERVE_B).unwrap_or(0);
        
        // Calculate LP shares
        let lp_shares: i128 = if reserve_a == 0 && reserve_b == 0 {
            // First liquidity: LP = sqrt(amount_a * amount_b)
            // Simplified: use geometric mean approximation
            amount_a.min(amount_b)
        } else {
            // Proportional to existing liquidity
            let shares_a = (amount_a * env.storage().instance().get(&KEY_TOTAL_LP).unwrap_or(1)) / reserve_a;
            let shares_b = (amount_b * env.storage().instance().get(&KEY_TOTAL_LP).unwrap_or(1)) / reserve_b;
            shares_a.min(shares_b)
        };
        
        if lp_shares <= 0 {
            panic!("LP shares must be positive");
        }
        
        // Update LP shares
        let mut lp_map: Map<Address, i128> = env
            .storage()
            .instance()
            .get(&KEY_LP_SHARES)
            .unwrap_or(Map::new(&env));
        
        let user_shares = lp_map.get(user.clone()).unwrap_or(0);
        lp_map.set(user.clone(), user_shares + lp_shares);
        env.storage().instance().set(&KEY_LP_SHARES, &lp_map);
        
        // Update total LP
        let total_lp: i128 = env.storage().instance().get(&KEY_TOTAL_LP).unwrap_or(0);
        env.storage().instance().set(&KEY_TOTAL_LP, &(total_lp + lp_shares));
        
        // Update reserves
        env.storage().instance().set(&KEY_RESERVE_A, &(reserve_a + amount_a));
        env.storage().instance().set(&KEY_RESERVE_B, &(reserve_b + amount_b));
        
        // Emit event
        env.events().publish(
            (symbol_short!("add_liq"),),
            (user, amount_a, amount_b, lp_shares),
        );
        
        lp_shares
    }

    /// Remove liquidity from the pool
    /// Returns amount_a and amount_b
    pub fn remove_liquidity(env: Env, user: Address, lp_amount: i128) -> (i128, i128) {
        user.require_auth();
        
        if lp_amount <= 0 {
            panic!("LP amount must be positive");
        }
        
        let reserve_a: i128 = env.storage().instance().get(&KEY_RESERVE_A).unwrap_or(0);
        let reserve_b: i128 = env.storage().instance().get(&KEY_RESERVE_B).unwrap_or(0);
        let total_lp: i128 = env.storage().instance().get(&KEY_TOTAL_LP).unwrap_or(0);
        
        if total_lp == 0 {
            panic!("No liquidity in pool");
        }
        
        // Calculate proportional amounts
        let amount_a = (lp_amount * reserve_a) / total_lp;
        let amount_b = (lp_amount * reserve_b) / total_lp;
        
        if amount_a <= 0 || amount_b <= 0 {
            panic!("Amounts must be positive");
        }
        
        // Update LP shares
        let mut lp_map: Map<Address, i128> = env
            .storage()
            .instance()
            .get(&KEY_LP_SHARES)
            .unwrap_or(Map::new(&env));
        
        let user_shares = lp_map.get(user.clone()).unwrap_or(0);
        if user_shares < lp_amount {
            panic!("Insufficient LP shares");
        }
        
        lp_map.set(user.clone(), user_shares - lp_amount);
        env.storage().instance().set(&KEY_LP_SHARES, &lp_map);
        
        // Update total LP
        env.storage().instance().set(&KEY_TOTAL_LP, &(total_lp - lp_amount));
        
        // Update reserves
        env.storage().instance().set(&KEY_RESERVE_A, &(reserve_a - amount_a));
        env.storage().instance().set(&KEY_RESERVE_B, &(reserve_b - amount_b));
        
        // Transfer tokens to user
        // Note: In production, use proper token transfer
        
        // Emit event
        env.events().publish(
            (symbol_short!("rm_liq"),),
            (user, amount_a, amount_b, lp_amount),
        );
        
        (amount_a, amount_b)
    }

    /// Swap tokens
    /// Returns amount out
    pub fn swap(env: Env, user: Address, input_token: Address, amount_in: i128) -> i128 {
        user.require_auth();
        
        if amount_in <= 0 {
            panic!("Amount in must be positive");
        }
        
        let token_a: Address = env.storage().instance().get(&KEY_TOKEN_A).unwrap();
        let token_b: Address = env.storage().instance().get(&KEY_TOKEN_B).unwrap();
        
        let (reserve_in, reserve_out, is_a_to_b) = if input_token == token_a {
            (
                env.storage().instance().get(&KEY_RESERVE_A).unwrap_or(0),
                env.storage().instance().get(&KEY_RESERVE_B).unwrap_or(0),
                true,
            )
        } else if input_token == token_b {
            (
                env.storage().instance().get(&KEY_RESERVE_B).unwrap_or(0),
                env.storage().instance().get(&KEY_RESERVE_A).unwrap_or(0),
                false,
            )
        } else {
            panic!("Invalid token");
        };
        
        if reserve_in == 0 || reserve_out == 0 {
            panic!("Pool has no liquidity");
        }
        
        // AMM formula: x * y = k with 0.25% fee
        // amount_out = (amount_in * 9975 * reserve_out) / (reserve_in * 10000 + amount_in * 9975)
        let amount_in_with_fee = amount_in * FEE_NUMERATOR;
        let numerator = amount_in_with_fee * reserve_out;
        let denominator = reserve_in * FEE_DENOMINATOR + amount_in_with_fee;
        
        let amount_out = numerator / denominator;
        
        if amount_out <= 0 {
            panic!("Amount out must be positive");
        }
        
        // Calculate fee (0.25%)
        let fee = (amount_in * 25) / FEE_DENOMINATOR;
        let treasury: Address = env.storage().instance().get(&KEY_TREASURY).unwrap();
        
        // Update reserves
        if is_a_to_b {
            let new_reserve_a = reserve_in + amount_in;
            let new_reserve_b = reserve_out - amount_out;
            env.storage().instance().set(&KEY_RESERVE_A, &new_reserve_a);
            env.storage().instance().set(&KEY_RESERVE_B, &new_reserve_b);
        } else {
            let new_reserve_b = reserve_in + amount_in;
            let new_reserve_a = reserve_out - amount_out;
            env.storage().instance().set(&KEY_RESERVE_B, &new_reserve_b);
            env.storage().instance().set(&KEY_RESERVE_A, &new_reserve_a);
        }
        
        // Emit event
        env.events().publish(
            (symbol_short!("swap"),),
            (user, input_token, amount_in, amount_out, fee, treasury),
        );
        
        amount_out
    }

    /// Get reserve of token A
    pub fn get_reserve_a(env: Env) -> i128 {
        env.storage().instance().get(&KEY_RESERVE_A).unwrap_or(0)
    }

    /// Get reserve of token B
    pub fn get_reserve_b(env: Env) -> i128 {
        env.storage().instance().get(&KEY_RESERVE_B).unwrap_or(0)
    }

    /// Get LP shares of user
    pub fn get_lp_shares(env: Env, user: Address) -> i128 {
        let lp_map: Map<Address, i128> = env
            .storage()
            .instance()
            .get(&KEY_LP_SHARES)
            .unwrap_or(Map::new(&env));
        
        lp_map.get(user).unwrap_or(0)
    }

    /// Get total LP shares
    pub fn get_total_lp(env: Env) -> i128 {
        env.storage().instance().get(&KEY_TOTAL_LP).unwrap_or(0)
    }

    /// Get token addresses
    pub fn get_tokens(env: Env) -> (Address, Address) {
        let token_a = env.storage().instance().get(&KEY_TOKEN_A).unwrap();
        let token_b = env.storage().instance().get(&KEY_TOKEN_B).unwrap();
        (token_a, token_b)
    }

    /// Get treasury address
    pub fn treasury(env: Env) -> Address {
        env.storage().instance().get(&KEY_TREASURY).unwrap()
    }
}

#[cfg(test)]
mod test;
