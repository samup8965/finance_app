import { useDataContext } from "../../context/DataContext";
import { useNavigate } from "react-router-dom";

const MonthlySummary = () => {
  const { recentTransactions, connectionStatus } = useDataContext();
  const navigate = useNavigate();

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthTransactions = recentTransactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  });

  const totalIncome = currentMonthTransactions
    .filter((t) => t.transaction_type === "CREDIT")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = currentMonthTransactions
    .filter((t) => t.transaction_type === "DEBIT")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const net = totalIncome - totalExpenses;
  const incomePercent =
    totalIncome + totalExpenses > 0
      ? Math.round((totalIncome / (totalIncome + totalExpenses)) * 100)
      : 0;

  const expensePercent = 100 - incomePercent;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 h-[300px] flex flex-col justify-between">
      <div className="flex justify-between text-sm text-gray-500 font-medium mb-1">
        <span>Monthly Summary</span>
        {connectionStatus === "connected" && (
          <button
            className="text-sm font-medium text-blue-600 hover:underline"
            onClick={() => navigate("/spendingTrends")}
          >
            View more
          </button>
        )}
      </div>

      {connectionStatus === "connected" && (
        <div className="text-3xl font-medium text-gray-900 mb-2">
          £{net.toFixed(2)}
        </div>
      )}

      {connectionStatus === "connected" &&
      currentMonthTransactions.length > 0 ? (
        <>
          <div className="flex justify-between items-start text-sm">
            {/* Income Section */}
            <div className="flex flex-col space-y-1">
              <div className="text-gray-900 font-semibold">
                £{totalIncome.toFixed(2)}
                <span className="text-gray-400 text-xs"> in</span>
              </div>

              {/* placeholder */}
              <div className="text-green-600 text-xs">{incomePercent}%</div>
            </div>

            {/* Expenses Section */}
            <div className="flex flex-col items-end space-y-1">
              <div className="text-gray-900 font-semibold">
                £{totalExpenses.toFixed(2)}
                <span className="text-gray-400 text-xs"> out</span>
              </div>

              <div className="text-red-600 text-xs">{expensePercent}%</div>
            </div>
          </div>

          {/**Progress bar section with vertical markers */}
          <div className="relative mt-4">
            {/* Progress Bar */}
            <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden flex items-center">
              {/* Green Bar (Income) */}
              <div
                className="h-full bg-green-600 relative"
                style={{ width: `${incomePercent}%` }}
              ></div>

              {/* Red Bar (Expense) */}
              <div
                className="h-full bg-red-500 relative ml-auto"
                style={{ width: `${expensePercent}%` }}
              ></div>
            </div>

            {/* Vertical markers positioned outside the progress bar */}
            {/* Vertical marker for green bar start (always at 0) */}
            <div className="absolute left-0 top-0 w-0.5 h-14 bg-green-700 -translate-y-12 rounded-full"></div>

            {/* Vertical marker for red bar start */}
            <div
              className="absolute top-0 w-0.5 h-14 bg-red-700 -translate-y-12"
              style={{ left: `${100 - expensePercent}%` }}
            ></div>
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-gray-400 text-xl">
              {connectionStatus === "connected" ? "📊" : "🔗"}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-600 text-sm font-medium">
            {connectionStatus === "connected"
              ? "No data this month"
              : "Connect to view summary"}
          </p>
        </div>
      )}
    </div>
  );
};

export default MonthlySummary;
