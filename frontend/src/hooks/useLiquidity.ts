import { useState } from "react";
import { callContract, signAndSendTransaction } from "../services/contract";
import { useAppStore } from "../store/appStore";

export function useLiquidity() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addTransaction = useAppStore((state) => state.addTransaction);

  const addLiquidity = async (
    contractId: string,
    amountA: number,
    amountB: number,
    address: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const { tx } = await callContract({
        contractId,
        method: "add_liquidity",
        args: [amountA, amountB],
        address,
      });

      const result = await signAndSendTransaction(tx);

      addTransaction({
        type: "add_liquidity",
        amountA,
        amountB,
        hash: result.hash,
        timestamp: Date.now(),
      });

      return { success: true };
    } catch (e: any) {
      setError(e.message || "Add liquidity failed");
      return { success: false, error: e.message };
    } finally {
      setLoading(false);
    }
  };

  const removeLiquidity = async (
    contractId: string,
    lpAmount: number,
    address: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const { tx } = await callContract({
        contractId,
        method: "remove_liquidity",
        args: [lpAmount],
        address,
      });

      const result = await signAndSendTransaction(tx);

      addTransaction({
        type: "remove_liquidity",
        lpAmount,
        hash: result.hash,
        timestamp: Date.now(),
      });

      return { success: true };
    } catch (e: any) {
      setError(e.message || "Remove liquidity failed");
      return { success: false, error: e.message };
    } finally {
      setLoading(false);
    }
  };

  return { addLiquidity, removeLiquidity, loading, error };
}
