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
  id: string;
  payee_name: string;
  amount: number;
  currency: string;
  last_payed: string;
  status: string;
  type: string;
  total: number;
}

export interface DirectDebit {
  id: string;
  payee_name: string;
  amount: number;
  currency: string;
  last_payed: string;
  status: string;
  type: string;
  total: number;
}

export type RecurringPayment = StandingOrder | DirectDebit;

interface DataType {
  // Connection states
  isConnected: boolean;
  setConnected: React.Dispatch<React.SetStateAction<boolean>>;
  hasError: boolean;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  showError: string | null;
  setShowError: React.Dispatch<React.SetStateAction<string>>;
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
  showError: "",
  setShowError: () => {},
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
  const [showError, setShowError] = useState("");
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

  const transformStandingOrder = (
    rawOrder: any,
    totalRecurringPayments: number
  ): StandingOrder => {
    return {
      id: rawOrder.standing_order_id,
      payee_name: rawOrder.display_name,
      amount: rawOrder.direct_debits,
      currency: rawOrder.currency,
      last_payed: rawOrder.previous_payment_timestamp,
      status: rawOrder.status,
      type: rawOrder.type,
      total: totalRecurringPayments,
    };
  };

  const transformDirectDebit = (
    rawDebit: any,
    totalRecurringPayments: number
  ): DirectDebit => {
    return {
      id: rawDebit.direct_debit_id,
      payee_name: rawDebit.name,
      amount: rawDebit.previous_payment_amount,
      currency: rawDebit.currency,
      last_payed: rawDebit.previous_payment_timestamp,
      status: rawDebit.status,
      type: rawDebit.type,
      total: totalRecurringPayments,
    };
  };

  useEffect(() => {
    setError(false);
    // Flow to prevent fetching
    if (!shouldFetchData) {
      return;
    }
    const fetchAccountData = async () => {
      try {
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

        const recurringResponse = await fetch("/api/recurring_payments", {
          method: "GET",
          credentials: "include",
        });

        const recurringData = await recurringResponse.json();

        if (
          !transactionResponse.ok ||
          !balanceResponse.ok ||
          !recurringResponse.ok
        ) {
          setShowError("Failed to fetch account data");
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

        const account = recurringData.accounts_with_recurring_payments[0];
        const transformedStandingOrders = account.standing_orders.map(
          (order: StandingOrder) =>
            transformStandingOrder(order, account.total_recurring_payments)
        );
        const transformedDirectDebits = account.direct_debits.map(
          (debit: DirectDebit) =>
            transformDirectDebit(debit, account.total_recurring_payments)
        );

        allStandingOrders.push(...transformedStandingOrders);
        allDirectDebits.push(...transformedDirectDebits);

        const allRecurringPayments = [
          ...allStandingOrders,
          ...allDirectDebits,
          account.total_recurring_payments,
        ];

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
        setShowError("There has been a network error. Please try again!");
        setShouldFetchData(false);
        setLoaded(true);
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
        showError,
        setShowError,
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
