export type ConnectionStatus =
  | "checking"
  | "connected"
  | "disconnected"
  | "error";

export interface Account {
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

export interface DataType {
  // Connection states
  connectionStatus: ConnectionStatus;
  setConnectionStatus: React.Dispatch<React.SetStateAction<ConnectionStatus>>;
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

  // Actions

  refreshData: () => Promise<void>;
  checkConnection: () => Promise<void>;
  forceRefresh: () => Promise<void>;
}
