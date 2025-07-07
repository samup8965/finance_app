import { useDataContext } from "../context/DataContext";

const Overview = () => {
  const { accounts, recentTransactions, isConnected, hasError, setError } =
    useDataContext();
  console.log("The state for having an account connected is ", isConnected);

  // Helper function to render account balance section

  const renderAccountBalance = () => (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
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
                <>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    +2.5%
                  </span>
                  <span className="text-blue-100 text-sm">from last month</span>
                </>
              ) : (
                <span className="text-blue-100 text-sm">
                  {isConnected ? "No recent data" : "Connect to view trends"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Helper to render recent transactions
  const renderRecentTransactions = () => (
    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Recent Transactions
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {isConnected
              ? "Your latest financial activity"
              : "Connect your account to view transactions"}
          </p>
        </div>
        {isConnected && recentTransactions.length > 0 && (
          <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
            View all
          </button>
        )}
      </div>

      <div className="space-y-4">
        {isConnected && recentTransactions.length > 0 ? (
          recentTransactions.slice(0, 4).map((transaction, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold bg-blue-100 text-blue-600">
                  {" "}
                  {transaction.transaction_category}
                </div>
                <div>
                  <p className="font-medium text-gray-600">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`font-semibold text-lg ${
                    transaction.amount > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {transaction.amount > 0 ? "+" : ""}$
                  {Math.abs(transaction.amount).toFixed(2)}
                </p>
              </div>
            </div>
          ))
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
    </div>
  );

  // Helper function to render monthly summary

  const renderMonthlySummary = () => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-10">
      <h4 className="font-semibold text-gray-900 mb-4">This month</h4>

      <div className="space-y-4">
        {isConnected && recentTransactions.length > 0 ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Income</span>
              <span className="font-semibold text-green-600">
                +$
                {recentTransactions
                  .filter((t) => t.amount > 0)
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Expenses</span>
              <span className="font-semibold text-red-600">
                +$
                {recentTransactions
                  .filter((t) => t.amount > 0)
                  .reduce((sum, t) => sum + Math.abs(t.amount), 0)
                  .toFixed(2)}
              </span>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Net Income</span>
                <span className="font-bold">
                  {recentTransactions
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

  // Helper function to render savings goal (dummy for now)
  const renderSavingsGoal = () => (
    <div className="bg-white dark:bg-secondary-dark-bg rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h4 className="font-semibold text-gray-900 dark:text-gray-800 mb-4">
        Savings Goal
      </h4>
      <div className="space-y-3">
        {isConnected ? (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Progress</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                $1,000 / $5,000
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full w-1/5"></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              20% complete • $4,000 remaining
            </p>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-gray-400 text-xl">🎯</span>
            </div>
            <p className="text-gray-600 dark:text-gray-600 text-sm font-medium">
              Connect to set savings goals
            </p>
          </div>
        )}
      </div>
    </div>
  );

  if (hasError) {
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-800 px-6 py-4 rounded-lg shadow-md z-50 flex items-center justify-between w-[90%] max-w-xl">
        <div className="flex items-center space-x-2">
          <span className="text-xl">⚠️</span>
          <span className="font-medium">{hasError}</span>
        </div>
        <button
          onClick={() => setError(false)}
          className="ml-4 text-red-600 hover:text-red-800 transition"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className=" mx-auto mt-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white-600">
          Financial Overview
        </h1>
        <p className="text-white-600">
          {isConnected
            ? "Track your finances and monitor your spending"
            : "Connect your account to start tracking your finances"}
        </p>
      </div>

      {renderAccountBalance()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {renderRecentTransactions()}
      </div>

      {/* Quick Stats Sidebar */}
      <div className="space-y-6 py-8">
        {/* Monthly Summary */}
        {renderMonthlySummary()}

        {renderSavingsGoal()}
      </div>
    </div>
  );
};

export default Overview;
