import { LineChart, Line, ResponsiveContainer } from "recharts";
import { getMonthlyExpenses } from "../../data/chartDataProcessing";
import { useDataContext } from "../../context/DataContext";

const ExpensesChart = () => {
  const { connectionStatus, recentTransactions } = useDataContext();
  const expensesData = getMonthlyExpenses(recentTransactions);

  const currentMonth =
    expensesData.length > 0
      ? expensesData[expensesData.length - 1].spending
      : 0;
  const previousMonth =
    expensesData.length > 1
      ? expensesData[expensesData.length - 2].spending
      : 0;
  const percentageChange =
    previousMonth > 0
      ? ((currentMonth - previousMonth) / previousMonth) * 100
      : 0;

  if (connectionStatus === "disconnected") {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Bank Connection Needed
        </h3>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-600 mb-2">
          Monthly Expenses
        </h3>
        <hr className="mb-2 border-t border-gray-200 " />
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              £{currentMonth.toLocaleString()}
            </div>
            <div className="flex items-center mt-1">
              <span
                className={`text-sm font-medium ${
                  percentageChange <= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {percentageChange >= 0 ? "+" : ""}
                {percentageChange.toFixed(1)}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs last month</span>
            </div>
          </div>
          <div className="w-20 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={expensesData}>
                <Line
                  type="monotone"
                  dataKey="spending"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensesChart;
