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

export interface Transaction {
  amount: number;
  description: string;
  date: string;
  transaction_type: string;
  transaction_category: string;
}

export interface StandingOrder {
  payee_name: string;
  amount: number;
  currency: string;
  frequency: string;
  next_payment_date: string;
  status: string;
  type: "standing_order";
}

export interface DirectDebit {
  payee_name: string;
  amount: number;
  currency: string;
  frequency: string;
  next_payment_date: string;
  status: string;
  type: "direct_debit";
}

export type RecurringPayment = StandingOrder | DirectDebit;

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
  recurringPayments: RecurringPayment[];
  standingOrders: StandingOrder[];
  directDebits: DirectDebit[];
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
  recurringPayments: [],
  standingOrders: [],
  directDebits: [],
  loaded: false,
  setLoaded: () => {},
});

export const DataProvider = ({ children }: { children: ReactNode }) => {
  // Current states
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );

  const [recurringPayments, setRecurringPayments] = useState<
    RecurringPayment[]
  >([]);
  const [standingOrders, setStandingOrders] = useState<StandingOrder[]>([]);
  const [directDebits, setDirectDebits] = useState<DirectDebit[]>([]);

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
      current_balance: rawAccount.balance[0].current,
      currency: rawAccount.balance[0].currency,
      sort_code: rawAccount.account_number.sort_code,
      account_number: rawAccount.account_number.number,
    };
  };

  const transformTransaction = (rawTransaction: any): Transaction => {
    return {
      amount: rawTransaction.amount,
      description: rawTransaction.description,
      date: rawTransaction.timestamp,
      transaction_type: rawTransaction.transaction_type,
      transaction_category: rawTransaction.transaction_category,
    };
  };

  const transformStandingOrder = (rawOrder: any): StandingOrder => {
    return {
      payee_name: rawOrder.payee_name || rawOrder.payee?.name || "Unknown",
      amount: rawOrder.amount,
      currency: rawOrder.currency,
      frequency: rawOrder.frequency || "monthly",
      next_payment_date: rawOrder.next_payment_date,
      status: rawOrder.status || "active",
      type: "standing_order",
    };
  };

  const transformDirectDebit = (rawDebit: any): DirectDebit => {
    return {
      payee_name: rawDebit.payee_name || rawDebit.payee?.name || "Unknown",
      amount: rawDebit.last_payment_amount,
      currency: rawDebit.currency,
      frequency: rawDebit.frequency,
      next_payment_date: rawDebit.next_payment_date,
      status: rawDebit.status || "active",
      type: "direct_debit",
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

        const recurringResponse = await fetch("/api/recurring-payments", {
          method: "GET",
          credentials: "include",
        });

        const recurringData = await recurringResponse.json();

        if (
          !transactionResponse.ok ||
          !balanceResponse.ok ||
          !recurringResponse.ok
        ) {
          console.error(" Failed to fetch account data:", transactionData);
          setError(true);
          setLoaded(true);
          setShouldFetchData(false);
          return;
        }
        console.log("balance data", recurringData);

        setShouldFetchData(false);

        // Transform and set state
        const transformedAccounts =
          balanceData.accounts_with_balances.map(transformAccount);

        const transformedTransactions =
          transactionData.accounts_with_transactions[0].transactions.map(
            transformTransaction
          );

        const allStandingOrders: StandingOrder[] = [];
        const allDirectDebits: DirectDebit[] = [];

        recurringData.accounts_with_recurring_payments.forEach(
          (account: any) => {
            const transformedStandingOrders = account.standing_orders.map(
              transformStandingOrder
            );
            const transformedDirectDebits =
              account.direct_debits.map(transformDirectDebit);

            allStandingOrders.push(...transformedStandingOrders);
            allDirectDebits.push(...transformedDirectDebits);
          }
        );

        const allRecurringPayments = [...allStandingOrders, ...allDirectDebits];

        setAccounts(transformedAccounts);
        setRecentTransactions(transformedTransactions);

        setStandingOrders(allStandingOrders);
        setDirectDebits(allDirectDebits);
        setRecurringPayments(allRecurringPayments);
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
        recurringPayments,
        standingOrders,
        directDebits,
        loaded,
        setLoaded,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);
