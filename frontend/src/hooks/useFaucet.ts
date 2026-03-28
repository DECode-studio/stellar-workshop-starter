import { useState } from "react";
import { callContract, signAndSendTransaction } from "../services/contract";
import { useAppStore } from "../store/appStore";

export function useFaucet() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addTransaction = useAppStore((state) => state.addTransaction);

  const faucet = async (
    tokenContract: string,
    to: string,
    amount: number,
    address: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const { tx } = await callContract({
        contractId: tokenContract,
        method: "mint",
        args: [to, amount],
        address,
      });

      const result = await signAndSendTransaction(tx);

      addTransaction({
        type: "faucet",
        token: tokenContract,
        to,
        amount,
        hash: result.hash,
        timestamp: Date.now(),
      });

      return { success: true };
    } catch (e: any) {
      setError(e.message || "Faucet failed");
      return { success: false, error: e.message };
    } finally {
      setLoading(false);
    }
  };

  return { faucet, loading, error };
}
