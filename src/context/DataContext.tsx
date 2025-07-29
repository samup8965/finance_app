import { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import { type ReactNode } from "react";
import { UserAuth } from "../context/AuthContext";

import {
  type Account,
  type Transaction,
  type StandingOrder,
  type DirectDebit,
  type RecurringPayment,
  type DataType,
  type ConnectionStatus,
} from "../types/bank_data";

const DataContext = createContext<DataType>({
  connectionStatus: "disconnected",
  setConnectionStatus: () => {},
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
  refreshData: async () => {},
  checkConnection: async () => {},
  forceRefresh: async () => {},
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

  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");
  const [hasError, setError] = useState(false);
  const [showError, setShowError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [lastUpdated, setUpdated] = useState("");

  const { session } = UserAuth();

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

  // Check bank connection status

  const checkConnection = async () => {
    setConnectionStatus("checking");
    setError(false);
    setShowError("");

    try {
      const response = await fetch("/api/check-connection-status", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!response.ok) {
        console.log("An error");
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.isConnected) {
        setConnectionStatus("connected");
        await fetchAccountData();
      } else {
        setConnectionStatus("disconnected");
        setLoaded(true);
      }
    } catch (error) {
      console.error("Error checking connection status:", error);
      setConnectionStatus("error");
      setError(true);
      setShowError("Failed to check connection status");
      setLoaded(true);
      throw error;
    }
  };

  const fetchAccountData = async (): Promise<void> => {
    try {
      setLoaded(false);
      setError(false);
      setShowError("");

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

        return;
      }
      console.log("balance data", recurringData);

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
    } catch (error) {
      setError(true);
      setShowError("There has been a network error. Please try again!");
      setLoaded(true);
    }
  };

  // RefreshData function for manual refresh

  const refreshData = async (): Promise<void> => {
    if (connectionStatus === "connected") {
      await fetchAccountData();
    } else {
      await checkConnection();
    }
  };

  const forceRefresh = async (): Promise<void> => {
    await checkConnection();
  };

  useEffect(() => {
    if (session) {
      checkConnection();
    } else {
      setConnectionStatus("disconnected");
      setLoaded(true);
    }
  }, [session]);

  return (
    <DataContext.Provider
      value={{
        connectionStatus,
        setConnectionStatus,
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
        refreshData,
        checkConnection,
        forceRefresh,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);
