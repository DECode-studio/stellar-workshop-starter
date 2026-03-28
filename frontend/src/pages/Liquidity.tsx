import { useState } from "react";
import { useWallet } from "../../hooks/useWallet";
import { useLiquidity } from "../../hooks/useLiquidity";
import { Button, Input, Card } from "../components/ui";
import { CONTRACTS } from "../../constants";

export default function Liquidity() {
  const { address } = useWallet();
  const { addLiquidity, removeLiquidity, loading, error } = useLiquidity();

  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [lpAmount, setLpAmount] = useState("");

  const handleAddLiquidity = async () => {
    if (!address) return;

    await addLiquidity(
      CONTRACTS.POOL,
      parseFloat(amountA),
      parseFloat(amountB),
      address
    );
  };

  const handleRemoveLiquidity = async () => {
    if (!address) return;

    await removeLiquidity(CONTRACTS.POOL, parseFloat(lpAmount), address);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Liquidity Pool</h1>

      <div className="grid gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Add Liquidity</h2>
          <div className="space-y-4">
            <Input
              label="Token A Amount"
              type="number"
              value={amountA}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmountA(e.target.value)}
              placeholder="0.0"
            />
            <Input
              label="Token B Amount"
              type="number"
              value={amountB}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmountB(e.target.value)}
              placeholder="0.0"
            />

            {error && (
              <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button
              onClick={handleAddLiquidity}
              disabled={!address || !amountA || !amountB || loading}
              className="w-full"
              loading={loading}
            >
              {!address ? "Connect Wallet" : "Add Liquidity"}
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Remove Liquidity</h2>
          <div className="space-y-4">
            <Input
              label="LP Tokens to Remove"
              type="number"
              value={lpAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLpAmount(e.target.value)}
              placeholder="0.0"
            />

            <Button
              onClick={handleRemoveLiquidity}
              disabled={!address || !lpAmount || loading}
              variant="outline"
              className="w-full"
              loading={loading}
            >
              Remove Liquidity
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Pool Stats</h2>
          <div className="space-y-2 text-gray-300">
            <div className="flex justify-between">
              <span>Reserve A:</span>
              <span>1,000</span>
            </div>
            <div className="flex justify-between">
              <span>Reserve B:</span>
              <span>1,000</span>
            </div>
            <div className="flex justify-between">
              <span>Your LP Share:</span>
              <span>0</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
