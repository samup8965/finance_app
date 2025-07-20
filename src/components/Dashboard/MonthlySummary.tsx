import { useDataContext } from "../../context/DataContext";

const renderMonthlySummary = () => {
  const { recentTransactions, isConnected } = useDataContext();
  // Get the current month and year
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Filter for current month
  const currentMonthTransactions = recentTransactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() == currentYear
    );
  });

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
                <span className="font-bold text-black">
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

export default renderMonthlySummary;
