import { LineChart, Line, ResponsiveContainer } from "recharts";
import { getMonthlyIncome } from "../data/chartDataProcessing";
import { useDataContext } from "../context/DataContext";

const IncomeChart = () => {
  const { recentTransactions } = useDataContext();
  const incomeData = getMonthlyIncome(recentTransactions);

  const currentMonth =
    incomeData.length > 0 ? incomeData[incomeData.length - 1].income : 0;
  const previousMonth =
    incomeData.length > 1 ? incomeData[incomeData.length - 2].income : 0;
  const percentageChange =
    previousMonth > 0
      ? ((currentMonth - previousMonth) / previousMonth) * 100
      : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-600 mb-2">
          Monthly Income
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
                  percentageChange >= 0 ? "text-green-600" : "text-red-600"
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
              <LineChart data={incomeData}>
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
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

export default IncomeChart;
