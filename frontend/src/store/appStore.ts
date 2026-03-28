import { create } from "zustand";

export interface Token {
  id: string;
  name: string;
  symbol: string;
  balance: string;
}

export interface Pool {
  id: string;
  tokenA: string;
  tokenB: string;
  reserveA: string;
  reserveB: string;
  lpShares: string;
}

interface AppState {
  tokens: Token[];
  pools: Pool[];
  balances: Record<string, string>;
  transactions: any[];
  setTokens: (tokens: Token[]) => void;
  setPools: (pools: Pool[]) => void;
  setBalances: (balances: Record<string, string>) => void;
  addTransaction: (tx: any) => void;
}

export const useAppStore = create<AppState>((set) => ({
  tokens: [],
  pools: [],
  balances: {},
  transactions: [],
  setTokens: (tokens) => set({ tokens }),
  setPools: (pools) => set({ pools }),
  setBalances: (balances) => set({ balances }),
  addTransaction: (tx) =>
    set((state) => ({ transactions: [tx, ...state.transactions] })),
}));
