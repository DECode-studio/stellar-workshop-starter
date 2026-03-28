export function getAmountOut(
  amountIn: number,
  reserveIn: number,
  reserveOut: number
): number {
  const amountInWithFee = amountIn * 9975;
  const numerator = amountInWithFee * reserveOut;
  const denominator = reserveIn * 10000 + amountInWithFee;
  return numerator / denominator;
}

export function getLpShares(
  amountA: number,
  amountB: number,
  reserveA: number,
  reserveB: number,
  totalLp: number
): number {
  if (reserveA === 0 && reserveB === 0) {
    return Math.sqrt(amountA * amountB);
  }
  const sharesA = (amountA * totalLp) / reserveA;
  const sharesB = (amountB * totalLp) / reserveB;
  return Math.min(sharesA, sharesB);
}

export function calculateSlippage(amount: number, slippage: number): number {
  return amount * (1 - slippage / 100);
}
