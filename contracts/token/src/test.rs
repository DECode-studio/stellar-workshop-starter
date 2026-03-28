#![cfg(test)]
use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env};

#[test]
fn test_initialize() {
    let env = Env::default();
    let contract_id = env.register_contract(None, Token);
    let client = TokenClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    client.initialize(&admin);
    
    assert_eq!(client.admin(), admin);
    assert_eq!(client.total_supply(), 0);
}

#[test]
fn test_mint() {
    let env = Env::default();
    let contract_id = env.register_contract(None, Token);
    let client = TokenClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    let user = Address::generate(&env);
    
    client.initialize(&admin);
    
    // Enable auth recording
    env.mock_all_auths();
    client.mint(&user, &1000);
    
    assert_eq!(client.balance_of(&user), 1000);
    assert_eq!(client.total_supply(), 1000);
}

#[test]
fn test_transfer() {
    let env = Env::default();
    let contract_id = env.register_contract(None, Token);
    let client = TokenClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    let from = Address::generate(&env);
    let to = Address::generate(&env);
    
    client.initialize(&admin);
    
    // Enable auth recording
    env.mock_all_auths();
    client.mint(&from, &1000);
    
    env.mock_all_auths();
    client.transfer(&from, &to, &500);
    
    assert_eq!(client.balance_of(&from), 500);
    assert_eq!(client.balance_of(&to), 500);
}

#[test]
#[should_panic(expected = "Insufficient balance")]
fn test_transfer_insufficient_balance() {
    let env = Env::default();
    let contract_id = env.register_contract(None, Token);
    let client = TokenClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    let from = Address::generate(&env);
    let to = Address::generate(&env);
    
    client.initialize(&admin);
    
    // Enable auth recording
    env.mock_all_auths();
    client.mint(&from, &100);
    
    env.mock_all_auths();
    client.transfer(&from, &to, &500);
}
