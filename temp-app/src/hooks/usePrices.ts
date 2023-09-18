import { useEffect, useState } from 'react';

interface Prices {
  [currency: string]: number;
}

const mockPrices: Prices = {
  ETH: 3000,
  BTC: 40000,
  DOT: 30,
};

export const usePrices = () => {
  const [prices, setPrices] = useState<Prices>({});

  useEffect(() => {
    // Simulate data fetching with a delay
    setTimeout(() => {
      setPrices(mockPrices);
    }, 1000);
  }, []);

  return prices;
};
