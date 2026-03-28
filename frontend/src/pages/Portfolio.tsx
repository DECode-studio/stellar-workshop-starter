import { useWallet } from "../hooks/useWallet";
import { useAppStore } from "../store/appStore";
import { Card } from "../components/ui";
import { formatAddress } from "../utils/format";

export default function Portfolio() {
  const { address } = useWallet();
  const tokens = useAppStore((state) => state.tokens);
  const pools = useAppStore((state) => state.pools);

  if (!address) {
    return (
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Portfolio</h1>
        <Card>
          <p className="text-gray-400">Connect your wallet to view portfolio</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Portfolio</h1>

      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Wallet Address</h2>
          <p className="text-gray-300 font-mono">{formatAddress(address)}</p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Token Balances</h2>
          {tokens.length > 0 ? (
            <div className="space-y-2">
              {tokens.map((token) => (
                <div
                  key={token.id}
                  className="flex justify-between py-3 border-t border-dark-700"
                >
                  <div>
                    <p className="font-medium">{token.name}</p>
                    <p className="text-sm text-gray-400">{token.symbol}</p>
                  </div>
                  <p className="text-lg">{token.balance}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No tokens found</p>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Liquidity Positions</h2>
          {pools.length > 0 ? (
            <div className="space-y-2">
              {pools.map((pool) => (
                <div
                  key={pool.id}
                  className="py-3 border-t border-dark-700"
                >
                  <p className="font-medium">
                    {pool.tokenA} / {pool.tokenB}
                  </p>
                  <p className="text-sm text-gray-400">
                    LP Shares: {pool.lpShares}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No liquidity positions</p>
          )}
        </Card>
      </div>
    </div>
  );
}
