import { useState } from "react";
import { useWallet } from "../../hooks/useWallet";
import { useFaucet } from "../../hooks/useFaucet";
import { Button, Input, Card } from "../components/ui";
import { CONTRACTS } from "../../constants";

export default function Faucet() {
  const { address } = useWallet();
  const { faucet, loading, error } = useFaucet();

  const [amount, setAmount] = useState("1000");
  const [selectedToken, setSelectedToken] = useState(CONTRACTS.TOKEN);

  const handleFaucet = async () => {
    if (!address) return;

    await faucet(selectedToken, address, parseFloat(amount), address);
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Token Faucet</h1>

      <Card>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Token
            </label>
            <select
              value={selectedToken}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedToken(e.target.value)}
              className="w-full bg-dark-800 border border-dark-700 rounded-md px-4 py-2 text-white"
            >
              <option value={CONTRACTS.TOKEN}>Test Token</option>
            </select>
          </div>

          <Input
            label="Amount"
            type="number"
            value={amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
            placeholder="1000"
          />

          {error && (
            <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="bg-dark-700 p-4 rounded-md">
            <p className="text-sm text-gray-400">
              Mint free test tokens for development and testing purposes.
            </p>
          </div>

          <Button
            onClick={handleFaucet}
            disabled={!address || loading}
            className="w-full"
            loading={loading}
          >
            {!address ? "Connect Wallet" : "Mint Tokens"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
