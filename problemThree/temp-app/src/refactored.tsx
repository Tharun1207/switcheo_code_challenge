import React from 'react';
import { useWalletBalances } from './hooks/useWalletBalances';
import { useEffect, useMemo, useState } from 'react';
import WalletRow from './pages/WalletRow';

interface WalletBalance {
    currency: string;
    amount: number;
    // Add a blockchain parameter in WalletBalance interface
    blockchain: string;
}

// FormattedWalletBalance is a sub interface of WalletBalance class, hence use inheritance
interface FormattedWalletBalance extends WalletBalance {
    formatted: string;
    // Adding usd value as an attribute
    usdValue: number;
}

class Datasource {
    constructor(private apiUrl: string) { }

    async getPrices(): Promise<{ [key: string]: number }> {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch data from ${this.apiUrl}. Status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }
}

// Implementing BoxProps
interface BoxProps {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

// Unnecessary interface can be removed
// interface Props extends BoxProps { }

const WalletPage: React.FC<BoxProps> = (props) => {
    // Props are not used, so can be removed
    // const { children, ...rest } = props;
    const balances = useWalletBalances();
    // Providing an initial state to match the expected shape of the data
    const [prices, setPrices] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        // Putting the code into a try-catch block to handle errors properly and to promote robustness
        const fetchData = async () => {
            try {
                const datasource = new Datasource("https://interview.switcheo.com/prices.json");
                const fetchedPrices = await datasource.getPrices();
                setPrices(fetchedPrices);
            } catch (error) {
                console.error(error);
            }
        };
        
        fetchData();
    }, []);

    // Using a specific type, i.e. string instead of any, to promote type safety
    const getPriority = (blockchain: string): number => {
        switch (blockchain) {
            case 'Osmosis':
                return 100
            case 'Ethereum':
                return 50
            case 'Arbitrum':
                return 30
            // 'Zilliqa' and 'Neo' return the same thing, so can be combined into one
                // return 20
            case 'Zilliqa':
            case 'Neo':
                return 20
            default:
                return -99
        }
    };

    // Adding the type of sortedBalances to promote type safety
    const sortedBalances: FormattedWalletBalance[] = useMemo(() => {
        return balances
            .filter((balance: WalletBalance) => {
                const balancePriority = getPriority(balance.blockchain);
                // Cleaner and concise looking code that does not compromise readability
                return balancePriority > -99 && balance.amount <= 0;
            })
            .sort((lhs: WalletBalance, rhs: WalletBalance) => {
                const leftPriority = getPriority(lhs.blockchain);
                const rightPriority = getPriority(rhs.blockchain);
                // Sorts in descending order this way 
                return rightPriority - leftPriority;

                // Missing else case that leads to undefined result when lhsPriority == rhsPriority
                // if (leftPriority > rightPriority) {
                //     return -1;
                // } else if (rightPriority > leftPriority) {
                //     return 1;
                // } else {
                //     return 0;
                // }
                
            })
            .map((balance) => ({
                ...balance,
                formatted: balance.amount.toFixed(),
                usdValue: prices[balance.currency] * balance.amount,
            }));
    }, [balances, prices]);

    // Instead of formatting the sorted balances separately, we format it right after the sort by mapping each
    // item and adding the 'formatted' and 'usdValue' properties

    // const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    //     return {
    //         ...balance,
    //         formatted: balance.amount.toFixed()
    //     };
    // });

    const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
        return (
            <WalletRow
                className="row"
                key={index}
                amount={balance.amount}
                usdValue={balance.usdValue}
                formattedAmount={balance.formatted}
            />
        );
    });

    return (
        <div {...props}>
            {rows}
        </div>
    );
};

// Need to export the page in order to be able to use this component
export default WalletPage;
