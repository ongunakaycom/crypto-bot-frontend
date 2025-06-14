import { create } from 'zustand';

const useTradeStore = create((set) => ({
  preferredMarket: 'coinbase',
  preferredCoin: 'btcusd',
  setPreferredMarket: (market) => set({ preferredMarket: market.toLowerCase() }),
  setPreferredCoin: (coin) => set({ preferredCoin: coin.toLowerCase() }),
}));

export default useTradeStore;
