import { useAppStore } from "../store/appStore";
import { Card } from "../components/ui";

export default function History() {
  const transactions = useAppStore((state) => state.transactions);

  const getTxTypeLabel = (type: string) => {
    switch (type) {
      case "swap":
        return "Swap";
      case "add_liquidity":
        return "Add Liquidity";
      case "remove_liquidity":
        return "Remove Liquidity";
      case "faucet":
        return "Faucet";
      default:
        return type;
    }
  };

  const getTxTypeColor = (type: string) => {
    switch (type) {
      case "swap":
        return "text-blue-400";
      case "add_liquidity":
        return "text-green-400";
      case "remove_liquidity":
        return "text-orange-400";
      case "faucet":
        return "text-purple-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Transaction History</h1>

      <Card>
        {transactions.length > 0 ? (
          <div className="space-y-2">
            {transactions.map((tx, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-4 border-t border-dark-700"
              >
                <div>
                  <p className={`font-medium ${getTxTypeColor(tx.type)}`}>
                    {getTxTypeLabel(tx.type)}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(tx.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  {tx.type === "swap" && (
                    <p className="text-sm">
                      {tx.amountIn} → {tx.amountOut?.toFixed(4)}
                    </p>
                  )}
                  {tx.type === "add_liquidity" && (
                    <p className="text-sm">
                      A: {tx.amountA}, B: {tx.amountB}
                    </p>
                  )}
                  {tx.type === "faucet" && (
                    <p className="text-sm">+{tx.amount} tokens</p>
                  )}
                  <a
                    href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    View on Explorer
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No transactions yet</p>
          </div>
        )}
      </Card>
    </div>
  );
}
