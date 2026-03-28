import { useWallet } from "../hooks/useWallet";
import { useAppStore } from "../store/appStore";
import { Card } from "../components/ui";
import { formatAddress, formatBalance } from "../utils/format";

export default function Home() {
  const { address } = useWallet();
  const tokens = useAppStore((state) => state.tokens);
  const pools = useAppStore((state) => state.pools);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Stellar DEX
        </h1>
        <p className="text-gray-400 text-lg">
          A decentralized exchange powered by Soroban on Stellar
        </p>
      </div>

      {!address && (
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-center">
          <p className="text-gray-300 mb-4">
            Connect your wallet to start trading
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Your Portfolio</h2>
          {address ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-400">
                Wallet: {formatAddress(address)}
              </p>
              {tokens.length > 0 ? (
                tokens.map((token) => (
                  <div
                    key={token.id}
                    className="flex justify-between py-2 border-t border-dark-700"
                  >
                    <span>{token.symbol}</span>
                    <span>{formatBalance(token.balance)}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No tokens yet</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Connect wallet to view portfolio</p>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Pool Overview</h2>
          <div className="space-y-2">
            {pools.length > 0 ? (
              pools.map((pool) => (
                <div
                  key={pool.id}
                  className="py-2 border-t border-dark-700"
                >
                  <p className="font-medium">
                    {pool.tokenA} / {pool.tokenB}
                  </p>
                  <p className="text-sm text-gray-400">
                    Liquidity: ${formatBalance(Number(pool.reserveA) + Number(pool.reserveB))}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No pools available</p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="text-center">
          <p className="text-3xl font-bold text-primary">$0</p>
          <p className="text-gray-400 text-sm mt-1">Total Value Locked</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-secondary">0</p>
          <p className="text-gray-400 text-sm mt-1">Total Trades</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-green-500">0</p>
          <p className="text-gray-400 text-sm mt-1">Total Pools</p>
        </Card>
      </div>
    </div>
  );
}
