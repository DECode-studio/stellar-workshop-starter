export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatNumber(num: number | string, decimals: number = 2): string {
  const number = typeof num === "string" ? parseFloat(num) : num;
  return number.toFixed(decimals);
}

export function formatBalance(balance: string | number, decimals: number = 2): string {
  const num = typeof balance === "string" ? parseFloat(balance) : balance;
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + "K";
  }
  return num.toFixed(decimals);
}

export function parseAmount(amount: string, decimals: number = 18): bigint {
  const parts = amount.split(".");
  const whole = BigInt(parts[0] || "0");
  const fraction = parts[1] || "";
  const paddedFraction = fraction.padEnd(decimals, "0").slice(0, decimals);
  return whole * BigInt(10 ** decimals) + BigInt(paddedFraction);
}
