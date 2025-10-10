import { create } from 'zustand';

const useTradeStore = create((set, get) => ({
  // Trading preferences
  preferredMarket: 'coinbase',
  preferredCoin: 'btcusd',
  
  // Actions to update preferences
  setPreferredMarket: (market) => set({ preferredMarket: market }),
  setPreferredCoin: (coin) => set({ preferredCoin: coin }),
  
  // You might also have API URL construction here
  getApiUrl: () => {
    const { preferredMarket, preferredCoin } = get();
    return `https://deep-seek-chat-bot-python.onrender.com/${preferredMarket}/${preferredCoin}`;
  }
}));

export default useTradeStore;