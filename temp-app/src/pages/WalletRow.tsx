import React from 'react';

interface WalletRowProps {
  amount: number;
  usdValue: number;
  formattedAmount: string;
  className?: string;
}

const WalletRow: React.FC<WalletRowProps> = ({
  amount,
  usdValue,
  formattedAmount,
  className,
}) => {
  return (
    <div className={`wallet-row ${className}`}>
      <div className="wallet-info">
        <div className="currency-amount">
          <span className="amount">{formattedAmount}</span>
          <span className="currency">USD</span>
        </div>
        <div className="balance-details">
          <span className="amount">{amount}</span>
          <span className="currency">TOKEN</span>
        </div>
      </div>
      <div className="usd-value">
        <span>${usdValue.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default WalletRow;
