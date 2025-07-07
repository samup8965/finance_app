import { useDataContext } from "../context/DataContext";

const Overview = () => {
  const { accounts, recentTransactions, isConnected, hasError } =
    useDataContext();

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
          <div className="text-right">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto mt-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Financial Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your finances and monitor your spending
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions - Takes up 2 columns on large screens */}
        <div className="lg:col-span-2 bg-white dark:bg-secondary-dark-bg rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-800">
                Recent Transactions
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Your latest financial activity
              </p>
            </div>
            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {earningData.slice(0, 4).map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold"
                    style={{
                      backgroundColor: item.iconBg,
                      color: item.iconColor,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {index === 0
                        ? "Today, 2:30 PM"
                        : index === 1
                        ? "Yesterday, 9:00 AM"
                        : index === 2
                        ? "Dec 28, 11:45 PM"
                        : "Dec 27, 3:15 PM"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold text-lg ${
                      item.percentage.startsWith("+")
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {item.percentage.startsWith("+") ? "+" : "-"}${item.amount}
                  </p>
                  <p
                    className={`text-sm ${
                      item.pcColor.startsWith("green")
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {item.percentage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats Sidebar */}
        <div className="space-y-6">
          {/* Monthly Summary */}
          <div className="bg-white dark:bg-secondary-dark-bg rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h4 className="font-semibold text-gray-900 dark:text-gray-800 mb-4">
              This Month
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Income</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  +$2,500
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Expenses
                </span>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  -$1,800
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    Net Income
                  </span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    +$700
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Savings Goal */}
          <div className="bg-white dark:bg-secondary-dark-bg rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h4 className="font-semibold text-gray-900 dark:text-gray-800 mb-4">
              Savings Goal
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Progress
                </span>
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
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Expense Breakdown Placeholder */}
        <div className="bg-white dark:bg-secondary-dark-bg rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Expense Breakdown
          </h4>
          <div className="h-64 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 dark:text-purple-300 text-2xl">
                  📊
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">
                Coming Soon
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Interactive pie chart
              </p>
            </div>
          </div>
        </div>

        {/* Balance Trends Placeholder */}
        <div className="bg-white dark:bg-secondary-dark-bg rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Balance Trends
          </h4>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 dark:text-blue-300 text-2xl">
                  📈
                </span>
              </div>
              <p className="text-gray-800 dark:text-gray-800 font-medium">
                Coming Soon
              </p>
              <p className="text-xs text-gray-800 dark:text-gray-800 mt-1">
                Interactive line chart
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
