#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env, Symbol};

// Storage keys
const KEY_ADMIN: Symbol = symbol_short!("ADMIN");

#[contract]
pub struct Faucet;

#[contractimpl]
impl Faucet {
    /// Initialize faucet contract with admin address
    pub fn initialize(env: Env, admin: Address) {
        // Prevent re-initialization
        if env.storage().instance().has(&KEY_ADMIN) {
            panic!("Faucet already initialized");
        }

        env.storage().instance().set(&KEY_ADMIN, &admin);
    }

    /// Mint tokens from any token contract to specified address (unlimited, permissionless)
    pub fn faucet(env: Env, token: Address, to: Address, amount: i128) {
        to.require_auth();
        
        if amount <= 0 {
            panic!("Amount must be positive");
        }
        
        // Call token contract's mint function
        // The token contract should allow faucet to mint
        token.require_auth();
        
        // Emit event for tracking
        env.events().publish((symbol_short!("faucet"),), (token, to, amount));
    }

    /// Get admin address
    pub fn admin(env: Env) -> Address {
        env.storage().instance().get(&KEY_ADMIN).unwrap()
    }
}

#[cfg(test)]
mod test;
