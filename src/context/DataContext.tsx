import { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import { type ReactNode } from "react";
import { useStateContext } from "../context/ContextProvider";

interface Account {
  account_id: string;
  display_name: string;
  current_balance: number;
  currency: string;
  sort_code: number;
  account_number: number;
}

interface Transaction {
  transaction_id: string;
  amount: number;
  description: string;
  date: string;
  transaction_type: string;
  transaction_category: string;
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
  loaded: boolean;
  setLoaded: React.Dispatch<React.SetStateAction<boolean>>;

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
  loaded: false,
  setLoaded: () => {},
});

export const DataProvider = ({ children }: { children: ReactNode }) => {
  // Current states
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );
  const [isConnected, setConnected] = useState(false);
  const [hasError, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [lastUpdated, setUpdated] = useState("");

  const { shouldFetchData, setShouldFetchData } = useStateContext();

  // API call to fetch the data

  const transformAccount = (rawAccount: any): Account => {
    return {
      account_id: rawAccount.account_id,
      display_name: rawAccount.display_name,
      current_balance: rawAccount.balance.current,
      currency: rawAccount.balance.currency,
      sort_code: rawAccount.account_number.sort_code,
      account_number: rawAccount.account_number.number,
    };
  };

  const transformTransaction = (rawTransaction: any): Transaction => {
    return {
      transaction_id: rawTransaction.transaction_id,
      amount: rawTransaction.balance.amount,
      description: rawTransaction.balance.description,
      date: rawTransaction.balance.timestamp,
      transaction_type: rawTransaction.balance.transaction_type,
      transaction_category: rawTransaction.balance.transaction_category,
      running_balance: rawTransaction.balance.running_balance.amount,
    };
  };

  useEffect(() => {
    setError(false);
    // Flow to prevent fetching
    if (!shouldFetchData) {
      console.log("Call has been blocked");
      return;
    }
    const fetchAccountData = async () => {
      try {
        console.log("Call has been made");
        // Fetch transaction
        const transactionResponse = await fetch("/api/transactions", {
          method: "GET",
          credentials: "include", // for cookies
        });

        const transactionData = await transactionResponse.json();

        const balanceResponse = await fetch("/api/balance", {
          method: "GET",
          credentials: "include",
        });
        const balanceData = await balanceResponse.json();

        if (!transactionResponse.ok || !balanceResponse.ok) {
          console.error(" Failed to fetch account data:", transactionData);
          setError(true);
          setLoaded(true);
          setShouldFetchData(false);
          return;
        }
        console.log("balance data", balanceData);

        console.log("Transaction data", transactionData);

        setShouldFetchData(false);

        // Transform and set state
        const transformedAccounts =
          balanceData.accounts_with_balances.map(transformAccount);

        const transformedTransactions =
          transactionData.accounts_with_transactions.map(transformTransaction);

        setAccounts(transformedAccounts);
        setRecentTransactions(transformedTransactions);
        setLoaded(true);
        setError(false);
        console.log("Sucessfuly stored in correct format");
      } catch (err) {
        setError(true);
        setShouldFetchData(false);
        console.error("Network error", err);
      }
    };

    fetchAccountData();
  }, [shouldFetchData]);
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
        loaded,
        setLoaded,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);
