import { useState } from "react";
import { useWallet } from "../../hooks/useWallet";
import { useSwap } from "../../hooks/useSwap";
import { Button, Input, Card, Modal } from "../components/ui";
import { CONTRACTS, SLIPPAGE_TOLERANCE } from "../../constants";

export default function Swap() {
  const { address } = useWallet();
  const { swap, loading, error } = useSwap();

  const [amountIn, setAmountIn] = useState("");
  const [tokenIn, setTokenIn] = useState("TOKEN_A");
  const [tokenOut, setTokenOut] = useState("TOKEN_B");
  const [showPreview, setShowPreview] = useState(false);
  const [amountOut, setAmountOut] = useState(0);

  const handleSwap = async () => {
    if (!address) return;

    const result = await swap(
      CONTRACTS.POOL,
      tokenIn,
      parseFloat(amountIn),
      address
    );

    if (result.success) {
      setAmountOut(result.amountOut);
      setShowPreview(true);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Swap Tokens</h1>

      <Card>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              From
            </label>
            <div className="flex space-x-2">
              <Input
                type="number"
                value={amountIn}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmountIn(e.target.value)}
                placeholder="0.0"
                className="flex-1"
              />
              <select
                value={tokenIn}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTokenIn(e.target.value)}
                className="bg-dark-700 border border-dark-700 rounded-md px-4 py-2 text-white"
              >
                <option value="TOKEN_A">Token A</option>
                <option value="TOKEN_B">Token B</option>
              </select>
            </div>
          </div>

          <div className="text-center text-gray-400">↓</div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              To
            </label>
            <div className="flex space-x-2">
              <Input
                type="text"
                value={amountOut || "0.0"}
                readOnly
                className="flex-1"
                placeholder="0.0"
              />
              <select
                value={tokenOut}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTokenOut(e.target.value)}
                className="bg-dark-700 border border-dark-700 rounded-md px-4 py-2 text-white"
              >
                <option value="TOKEN_A">Token A</option>
                <option value="TOKEN_B">Token B</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-400">
            <p>Slippage Tolerance: {SLIPPAGE_TOLERANCE}%</p>
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button
            onClick={handleSwap}
            disabled={!address || !amountIn || loading}
            className="w-full"
            loading={loading}
          >
            {!address ? "Connect Wallet" : "Swap"}
          </Button>
        </div>
      </Card>

      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Swap Preview"
      >
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-gray-400">You'll receive</p>
            <p className="text-2xl font-bold">{amountOut.toFixed(4)}</p>
          </div>
          <Button onClick={() => setShowPreview(false)} className="w-full">
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}
