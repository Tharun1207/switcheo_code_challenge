import React, { useMemo } from 'react';
import WalletRow from './pages/WalletRow';
import { usePrices } from './hooks/usePrices'; 
import { useWalletBalances } from './hooks/useWalletBalances';// Import your custom hooks

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number;
}

interface WalletRowProps {
  amount: number;
  usdValue: number;
  formattedAmount: string;
}

interface Props {
  // Add any additional props here
}

const WalletPage: React.FC<Props> = (props) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100;
      case 'Ethereum':
        return 50;
      case 'Arbitrum':
        return 30;
      case 'Zilliqa':
      case 'Neo':
        return 20; // Combine 'Zilliqa' and 'Neo' cases
      default:
        return -99;
    }
  };

  const sortedBalances: FormattedWalletBalance[] = useMemo(() => {
    return balances
      .filter((balance) => {
        const balancePriority = getPriority(balance.blockchain);
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs, rhs) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        return rightPriority - leftPriority; // Sort in descending order
      })
      .map((balance) => ({
        ...balance,
        formatted: balance.amount.toFixed(),
        usdValue: prices[balance.currency] * balance.amount,
      }));
  }, [balances, prices]);

  return (
    <div {...props}>
      {sortedBalances.map((balance, index) => (
        <WalletRow
          className="row"
          key={index}
          amount={balance.amount}
          usdValue={balance.usdValue}
          formattedAmount={balance.formatted}
        />
      ))}
    </div>
  );
};

export default WalletPage;
