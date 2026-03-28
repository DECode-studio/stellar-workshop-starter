import {
  TransactionBuilder,
  BASE_FEE,
  Contract,
} from "soroban-client";
import { sorobanServer } from "../config/soroban";
import { NETWORK_PASSPHRASE } from "../constants";

export interface CallContractParams {
  contractId: string;
  method: string;
  args: any[];
  address?: string;
}

export async function getAccount(address: string) {
  return await sorobanServer.getAccount(address);
}

export async function callContract({
  contractId,
  method,
  args,
  address,
}: CallContractParams) {
  if (!address) {
    throw new Error("Wallet address required");
  }

  const account = await getAccount(address);

  // Create contract instance
  const contract = new Contract(contractId);

  // Build transaction
  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();

  // Simulate transaction
  const simulation = await sorobanServer.simulateTransaction(tx);

  return { tx, simulation };
}

export async function signAndSendTransaction(tx: any) {
  if (!window.freighterApi) {
    throw new Error("Freighter wallet not available");
  }

  // Sign transaction
  const signedXdr = await window.freighterApi.signTransaction(tx.toXDR(), {
    network: "TESTNET",
  });

  // Send transaction
  const signedTx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
  const result = await sorobanServer.sendTransaction(signedTx);

  return result;
}
