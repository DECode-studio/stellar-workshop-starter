import { useState } from "react";
import { callContract, signAndSendTransaction } from "../services/contract";
import { getAmountOut } from "../utils/math";
import { useAppStore } from "../store/appStore";

export function useSwap() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addTransaction = useAppStore((state) => state.addTransaction);

  const swap = async (
    contractId: string,
    tokenIn: string,
    amountIn: number,
    address: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Get reserves (mock data for now)
      const reserveIn = 1000;
      const reserveOut = 1000;

      // Calculate output
      const amountOut = getAmountOut(amountIn, reserveIn, reserveOut);

      // Build transaction
      const { tx } = await callContract({
        contractId,
        method: "swap",
        args: [tokenIn, amountIn],
        address,
      });

      // Sign and send
      const result = await signAndSendTransaction(tx);

      // Record transaction
      addTransaction({
        type: "swap",
        tokenIn,
        amountIn,
        amountOut,
        hash: result.hash,
        timestamp: Date.now(),
      });

      return { success: true, amountOut };
    } catch (e: any) {
      setError(e.message || "Swap failed");
      return { success: false, error: e.message };
    } finally {
      setLoading(false);
    }
  };

  return { swap, loading, error };
}
