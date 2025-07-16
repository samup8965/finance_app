import { useDataContext } from "../context/DataContext";
import { categoryIcons } from "../assets/Icons";
import { type CategoryKey } from "../types/CategoryKey";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { type SavingsGoal } from "../types/savingstypes";

const Overview = () => {
  const { accounts, recentTransactions, isConnected, hasError, setError } =
    useDataContext();
  // States for rendering saving goals
  const [savingGoal, setSavingGoal] = useState<SavingsGoal>();
  const [loading, setLoading] = useState(true);

  const progressPercent =
    ((savingGoal?.saved_amount ?? 0) / (savingGoal?.target_amount ?? 1)) * 100; // Optional chaning ? access if undefined and ?? is default for null/ undefined

  console.log("The state for having an account connected is ", isConnected);
  const navigate = useNavigate();

  // Fetch for getting saving goals from database

  useEffect(() => {
    const fetchSavingGoal = async () => {
      setLoading(true);
      setError(false);

      try {
        const { data, error } = await supabase
          .from("savings_goals")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1);

        if (error) {
          throw error;
        }
        setSavingGoal(data?.[0] || null);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSavingGoal();
  }, []);

  // Helper function to render account balance section

  const renderAccountBalance = () => (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg max-w-6xl">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-blue-100 text-sm font-medium mb-2">
              Total Balance
            </p>
            <p className="text-4xl font-bold mb-2">
              {/**Using a ternary expression with template string to display dynamically */}

              {isConnected && accounts.length > 0
                ? `${
                    accounts[0].currency === "GBP" ? "£" : "$"
                  }${accounts[0].current_balance.toFixed(2)}`
                : isConnected
                ? "No accounts found"
                : "Connect your account"}
            </p>
            <div className="flex items-center space-x-2">
              {isConnected && accounts.length > 0 ? (
                <div className="mt-2 text-sm text-blue-100">
                  <span className="mr-4">
                    <span className="font-medium text-white">Sort Code:</span>{" "}
                    {accounts[0].sort_code}
                  </span>
                  <span>
                    <span className="font-medium text-white">
                      Account Number:
                    </span>{" "}
                    {accounts[0].account_number}
                  </span>
                </div>
              ) : (
                <span className="text-blue-100 text-sm">
                  {isConnected ? "No recent data" : ""}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRecentTransactions = () => (
    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Recent Transactions
          </h3>
          <p className="text-sm text-gray-500">
            {isConnected
              ? "A snapshot of your latest activity"
              : "Connect your account to view transactions"}
          </p>
        </div>
        {isConnected && recentTransactions.length > 0 && (
          <button
            className="text-sm font-medium text-blue-600 hover:underline"
            onClick={() => navigate("/transactions")}
          >
            View all
          </button>
        )}
      </div>

      {isConnected && recentTransactions.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {recentTransactions.slice(0, 4).map((transaction, index) => (
            <li key={index} className="py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Circle Icon with initials or category */}
                <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                  {/* We use as CategoryKey because we know its one of those we*/}
                  {categoryIcons[
                    transaction.transaction_category as CategoryKey
                  ] ?? categoryIcons.UNKNOWN}
                </div>

                {/* Transaction Info */}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(transaction.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div className="text-right">
                <p
                  className={`text-sm font-semibold ${
                    transaction.amount > 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {transaction.amount > 0 ? "+" : "-"}£
                  {Math.abs(transaction.amount).toFixed(2)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-2xl">
              {isConnected ? "📄" : "🔗"}
            </span>
          </div>
          <p className="text-gray-600 font-medium">
            {isConnected
              ? "Your transactions will appear here"
              : "Link your bank account to view transactions"}
          </p>
        </div>
      )}
    </div>
  );

  // Helper function to render monthly summary

  const renderMonthlySummary = () => {
    // Get the current month and year
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter for current month
    const currentMonthTransactions = recentTransactions.filter(
      (transaction) => {
        const transactionDate = new Date(transaction.date);
        return (
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() == currentYear
        );
      }
    );

    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-10">
        <h4 className="font-semibold text-gray-900 mb-4">This month</h4>

        <div className="space-y-4">
          {isConnected && currentMonthTransactions.length > 0 ? (
            <>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Income</span>
                <span className="font-semibold text-green-600">
                  +£
                  {currentMonthTransactions
                    .filter((t) => t.transaction_type === "CREDIT")
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Expenses</span>
                <span className="font-semibold text-red-600">
                  -£
                  {currentMonthTransactions
                    .filter((t) => t.transaction_type === "DEBIT")
                    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
                    .toFixed(2)}
                </span>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Net Income</span>
                  <span className="font-bold">
                    {currentMonthTransactions
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-gray-400 text-xl">
                  {isConnected ? "📊" : "🔗"}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-600 text-sm font-medium">
                {isConnected ? "No data this month" : "Connect to view summary"}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Helper function to render savings goal (dummy for now)
  const renderSavingsGoal = () => (
    <div className="bg-white dark:bg-secondary-dark-bg rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h4 className="font-semibold text-gray-900 dark:text-gray-800 mb-4">
        Saving Goal
      </h4>
      <div className="space-y-3">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ) : savingGoal ? (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {savingGoal.goal_name}
              </span>
              <span className="font-medium dark:text-gray-900">
                ${savingGoal.saved_amount} / ${savingGoal.target_amount}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              {Math.round(
                (savingGoal.saved_amount / savingGoal.target_amount) * 100
              )}
              % complete • ${savingGoal.target_amount - savingGoal.saved_amount}{" "}
              remaining
            </p>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-gray-400 text-xl">🎯</span>
            </div>
            <p className="text-gray-600 dark:text-gray-600 text-sm font-medium">
              No saving goals yet
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="mx-auto mt-8 px-4 max-w-7xl">
      {hasError && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-800 px-6 py-4 rounded-lg shadow-md z-50 flex items-center justify-between w-[90%] max-w-xl">
          <div className="flex items-center space-x-2">
            <span className="text-xl">⚠️</span>
            <span className="font-medium">
              There has been an error connecting your account. Please try again
            </span>
          </div>
          <button
            onClick={() => setError(false)}
            className="ml-4 text-red-600 hover:text-red-800 transition"
          >
            ✕
          </button>
        </div>
      )}

      <div className="mb-8 ">
        <h1 className="text-2xl font-bold text-white-900">
          Financial Overview
        </h1>
        <p className="text-gray-600">
          {isConnected
            ? "Track your finances and monitor your spending"
            : "Connect your account to start tracking your finances"}
        </p>
      </div>

      {renderAccountBalance()}

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl">
        {/* Left side: Summary + Goal */}
        <div className="lg:col-span-2 space-y-6">
          {renderRecentTransactions()}
        </div>

        {/* Right side: Transactions */}
        <div className="lg:col-span-1 space-y-6">
          {renderMonthlySummary()}
          {renderSavingsGoal()}
        </div>
      </section>
    </div>
  );
};

export default Overview;
