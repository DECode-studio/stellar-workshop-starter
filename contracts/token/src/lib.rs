#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Map, Symbol};

// Storage keys
const KEY_ADMIN: Symbol = symbol_short!("ADMIN");
const KEY_BALANCES: Symbol = symbol_short!("BAL");
const KEY_TOTAL_SUPPLY: Symbol = symbol_short!("SUPPLY");

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct TokenMetadata {
    pub admin: Address,
    pub total_supply: i128,
}

#[contract]
pub struct Token;

#[contractimpl]
impl Token {
    /// Initialize token contract with admin address
    pub fn initialize(env: Env, admin: Address) {
        // Prevent re-initialization
        if env.storage().instance().has(&KEY_ADMIN) {
            panic!("Token already initialized");
        }
        
        env.storage().instance().set(&KEY_ADMIN, &admin);
        env.storage().instance().set(&KEY_TOTAL_SUPPLY, &0i128);
        env.storage().instance().set(&KEY_BALANCES, &Map::<Address, i128>::new(&env));
    }

    /// Mint new tokens to specified address
    pub fn mint(env: Env, to: Address, amount: i128) {
        let admin: Address = env.storage().instance().get(&KEY_ADMIN).unwrap();
        admin.require_auth();
        
        if amount <= 0 {
            panic!("Amount must be positive");
        }
        
        // Update balances
        let mut balances: Map<Address, i128> = env
            .storage()
            .instance()
            .get(&KEY_BALANCES)
            .unwrap_or(Map::new(&env));
        
        let current_balance = balances.get(to.clone()).unwrap_or(0);
        balances.set(to.clone(), current_balance + amount);
        
        // Update total supply
        let total_supply: i128 = env.storage().instance().get(&KEY_TOTAL_SUPPLY).unwrap_or(0);
        env.storage().instance().set(&KEY_TOTAL_SUPPLY, &(total_supply + amount));
        env.storage().instance().set(&KEY_BALANCES, &balances);
        
        // Emit event
        env.events().publish((symbol_short!("mint"),), (to, amount));
    }

    /// Transfer tokens from one address to another
    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        from.require_auth();
        
        if amount <= 0 {
            panic!("Amount must be positive");
        }
        
        let mut balances: Map<Address, i128> = env
            .storage()
            .instance()
            .get(&KEY_BALANCES)
            .unwrap();
        
        let from_balance = balances.get(from.clone()).unwrap_or(0);
        if from_balance < amount {
            panic!("Insufficient balance");
        }
        
        balances.set(from.clone(), from_balance - amount);
        
        let to_balance = balances.get(to.clone()).unwrap_or(0);
        balances.set(to.clone(), to_balance + amount);
        
        env.storage().instance().set(&KEY_BALANCES, &balances);
        
        // Emit event
        env.events().publish((symbol_short!("transfer"),), (from, to, amount));
    }

    /// Get balance of specified address
    pub fn balance_of(env: Env, user: Address) -> i128 {
        let balances: Map<Address, i128> = env
            .storage()
            .instance()
            .get(&KEY_BALANCES)
            .unwrap_or(Map::new(&env));
        
        balances.get(user).unwrap_or(0)
    }

    /// Get total supply of tokens
    pub fn total_supply(env: Env) -> i128 {
        env.storage().instance().get(&KEY_TOTAL_SUPPLY).unwrap_or(0)
    }

    /// Get admin address
    pub fn admin(env: Env) -> Address {
        env.storage().instance().get(&KEY_ADMIN).unwrap()
    }
}

#[cfg(test)]
mod test;
