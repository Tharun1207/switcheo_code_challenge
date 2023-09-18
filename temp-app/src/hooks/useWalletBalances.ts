import { useEffect, useState } from 'react';

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

const mockWalletBalances: WalletBalance[] = [
  { currency: 'ETH', amount: 5.0, blockchain: 'Ethereum' },
  { currency: 'BTC', amount: 2.0, blockchain: 'Bitcoin' },
  { currency: 'DOT', amount: 10.0, blockchain: 'Polkadot' },
];

export const useWalletBalances = () => {
  const [balances, setBalances] = useState<WalletBalance[]>([]);

  useEffect(() => {
    // Simulate data fetching with a delay
    setTimeout(() => {
      setBalances(mockWalletBalances);
    }, 1000);
  }, []);

  return balances;
};
