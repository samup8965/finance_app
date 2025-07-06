import { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import { type ReactNode } from "react";

interface Account {
  account_id: string;
  display_name: string;
  current_balance: number;
  currency: string;
}

interface Transaction {
  transaction_id: string;
  amount: number;
  description: string;
  date: string;
  transaction_type: string;
  running_balance: number;
}

interface DataType {
  // Connection states
  isConnected: boolean;
  setConnected: React.Dispatch<React.SetStateAction<boolean>>;
  hasError: boolean;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  lastUpdated: string | null;
  setUpdated: React.Dispatch<React.SetStateAction<string>>;

  // Data
  accounts: Account[];
  recentTransactions: Transaction[];
}

const DataContext = createContext<DataType>({
  isConnected: false,
  setConnected: () => {},
  hasError: false,
  setError: () => {},
  lastUpdated: "",
  setUpdated: () => {},
  accounts: [],
  recentTransactions: [],
});

export const DataProvider = ({ children }: { children: ReactNode }) => {
  // Current states
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );
  const [isConnected, setConnected] = useState(false);
  const [hasError, setError] = useState(false);
  const [lastUpdated, setUpdated] = useState("");

  // API call to fetch the data

  const transformAccount = (rawAccount: any): Account => {
    return {
      account_id: rawAccount.account_id,
      display_name: rawAccount.display_name,
      current_balance: rawAccount.running_balance.current,
      currency: rawAccount.balance.currency,
    };
  };

  const transformTransaction = (rawTransaction: any): Transaction => {
    return {
      transaction_id: rawTransaction.transaction_id,
      amount: rawTransaction.amount,
      description: rawTransaction.description,
      date: rawTransaction.timestamp,
      transaction_type: rawTransaction.transaction_type,
      running_balance: rawTransaction.running_balance.amount,
    };
  };

  useEffect(() => {
    setError(false);
    const fetchAccountData = async () => {
      try {
        // Fetch transaction
        const transactionResponse = await fetch("/api/transactions", {
          method: "GET",
          credentials: "include", // for cookies
        });

        const transactionData = await transactionResponse.json();

        const balanceResponse = await fetch("api/balance", {
          method: "GET",
          credentials: "include",
        });
        const balanceData = await balanceResponse.json();

        if (!transactionResponse.ok || !balanceResponse.ok) {
          console.error(" Failed to fetch account data:", transactionData);
          setError(true);
          return;
        }

        // Transform and set state
        const transformedAccounts =
          balanceData.accounts_with_balances.map(transformAccount);

        const transformedTransactions =
          transactionData.accounts_with_transactions.map(transformTransaction);

        setAccounts(transformedAccounts);
        setRecentTransactions(transformedTransactions);

        console.log("Accounts data", transactionData);
      } catch (err) {
        setError(true);
        console.error("Network error: err");
      }
    };

    fetchAccountData();
  }, []);
  return (
    <DataContext.Provider
      value={{
        isConnected,
        setConnected,
        hasError,
        setError,
        lastUpdated,
        setUpdated,
        accounts,
        recentTransactions,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);
