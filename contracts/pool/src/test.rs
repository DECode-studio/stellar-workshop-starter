#![cfg(test)]
use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env};

#[test]
fn test_initialize() {
    let env = Env::default();
    let contract_id = env.register_contract(None, Pool);
    let client = PoolClient::new(&env, &contract_id);
    
    let token_a = Address::generate(&env);
    let token_b = Address::generate(&env);
    let treasury = Address::generate(&env);
    
    client.initialize(&token_a, &token_b, &treasury);
    
    let (t_a, t_b) = client.get_tokens();
    assert_eq!(t_a, token_a);
    assert_eq!(t_b, token_b);
    assert_eq!(client.get_reserve_a(), 0);
    assert_eq!(client.get_reserve_b(), 0);
}

#[test]
fn test_add_liquidity() {
    let env = Env::default();
    let contract_id = env.register_contract(None, Pool);
    let client = PoolClient::new(&env, &contract_id);
    
    let token_a = Address::generate(&env);
    let token_b = Address::generate(&env);
    let treasury = Address::generate(&env);
    let user = Address::generate(&env);
    
    client.initialize(&token_a, &token_b, &treasury);
    
    // Enable auth recording
    env.mock_all_auths();
    let lp_shares = client.add_liquidity(&user, &1000, &1000);
    
    assert_eq!(lp_shares, 1000);
    assert_eq!(client.get_reserve_a(), 1000);
    assert_eq!(client.get_reserve_b(), 1000);
    assert_eq!(client.get_lp_shares(&user), 1000);
}

#[test]
fn test_swap() {
    let env = Env::default();
    let contract_id = env.register_contract(None, Pool);
    let client = PoolClient::new(&env, &contract_id);
    
    let token_a = Address::generate(&env);
    let token_b = Address::generate(&env);
    let treasury = Address::generate(&env);
    let user = Address::generate(&env);
    
    client.initialize(&token_a, &token_b, &treasury);
    
    // Enable auth recording for add liquidity
    env.mock_all_auths();
    client.add_liquidity(&user, &1000, &1000);
    
    // Enable auth recording for swap
    env.mock_all_auths();
    let amount_out = client.swap(&user, &token_a, &100);
    
    // amount_out = (100 * 9975 * 1000) / (1000 * 10000 + 100 * 9975)
    // = 997500000 / 10997500 = 90
    assert!(amount_out > 0);
    assert!(amount_out < 100); // Should be less due to fee
}
