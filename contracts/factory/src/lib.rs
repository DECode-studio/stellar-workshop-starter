#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env, Map, Symbol, Vec};

// Storage keys
const KEY_ADMIN: Symbol = symbol_short!("ADMIN");
const KEY_POOLS: Symbol = symbol_short!("POOLS");

#[contract]
pub struct Factory;

#[contractimpl]
impl Factory {
    /// Initialize factory contract with admin address
    pub fn initialize(env: Env, admin: Address) {
        // Prevent re-initialization
        if env.storage().instance().has(&KEY_ADMIN) {
            panic!("Factory already initialized");
        }

        env.storage().instance().set(&KEY_ADMIN, &admin);
        env.storage().instance().set(&KEY_POOLS, &Map::<(Address, Address), Address>::new(&env));
    }

    /// Create a new pool for token pair
    /// Returns the pool address
    pub fn create_pool(env: Env, token_a: Address, token_b: Address) -> Address {
        // Ensure token_a < token_b for consistent pairing
        let (token_0, token_1) = if token_a < token_b {
            (token_a.clone(), token_b.clone())
        } else {
            (token_b.clone(), token_a.clone())
        };
        
        // Check if pool already exists
        let pools: Map<(Address, Address), Address> = env
            .storage()
            .instance()
            .get(&KEY_POOLS)
            .unwrap_or(Map::new(&env));
        
        if pools.get((token_0.clone(), token_1.clone())).is_some() {
            panic!("Pool already exists");
        }
        
        // For now, return a deterministic address based on token pair
        // In production, you would deploy a new contract here
        use soroban_sdk::String;
        let pool_address = Address::from_string(&String::from_str(&env, "POOLPLACEHOLDER"));
        
        // Store pool mapping
        let mut pools: Map<(Address, Address), Address> = env
            .storage()
            .instance()
            .get(&KEY_POOLS)
            .unwrap_or(Map::new(&env));
        
        pools.set((token_0.clone(), token_1.clone()), pool_address.clone());
        env.storage().instance().set(&KEY_POOLS, &pools);
        
        // Emit event
        env.events().publish(
            (symbol_short!("pool_cr"),),
            (token_0, token_1, pool_address.clone()),
        );
        
        pool_address
    }

    /// Get pool address for token pair
    pub fn get_pool(env: Env, token_a: Address, token_b: Address) -> Option<Address> {
        let (token_0, token_1) = if token_a < token_b {
            (token_a, token_b)
        } else {
            (token_b, token_a)
        };
        
        let pools: Map<(Address, Address), Address> = env
            .storage()
            .instance()
            .get(&KEY_POOLS)
            .unwrap_or(Map::new(&env));
        
        pools.get((token_0, token_1))
    }

    /// Get all pools
    pub fn get_all_pools(env: Env) -> Vec<(Address, Address, Address)> {
        let pools: Map<(Address, Address), Address> = env
            .storage()
            .instance()
            .get(&KEY_POOLS)
            .unwrap_or(Map::new(&env));
        
        let mut result = Vec::new(&env);
        for (tokens, pool_address) in pools.iter() {
            result.push_back((pool_address.clone(), tokens.0, tokens.1));
        }
        result
    }

    /// Get admin address
    pub fn admin(env: Env) -> Address {
        env.storage().instance().get(&KEY_ADMIN).unwrap()
    }
}

#[cfg(test)]
mod test;
