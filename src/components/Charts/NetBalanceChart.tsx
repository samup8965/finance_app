import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getMonthlyBalance } from "../../data/chartDataProcessing";
import { useDataContext } from "../../context/DataContext";

const NetBalanceChart = () => {
  const { connectionStatus, recentTransactions } = useDataContext();
  const balanceData = getMonthlyBalance(recentTransactions);

  // Get current balance (latest month)
  const currentBalance =
    balanceData.length > 0 ? balanceData[balanceData.length - 1].balance : 0;

  if (connectionStatus === "disconnected") {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Bank Connection Needed
        </h3>
        <p className="text-gray-600 mb-4">
          To view your monthly balance insights, please connect your bank
          account.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          Monthly Net Balance
        </h3>
        <div className="text-3xl font-bold text-gray-900">
          {currentBalance < 0 && <span className="text-black-500">-</span>}£
          {Math.abs(currentBalance).toLocaleString()}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          data={balanceData}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          {/* Define gradient */}
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#6b7280" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickFormatter={(value) => `£${value}`}
          />
          <Tooltip
            formatter={(value) => [`£${value}`, "Balance"]}
            labelStyle={{ color: "#374151" }}
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "none",
              borderRadius: "8px",
              color: "white",
            }}
          />

          <Area
            type="monotone"
            dataKey="balance"
            stroke="#3b82f6"
            fill="url(#colorBalance)"
            strokeWidth={2}
            dot={{ fill: "#3b82f6", strokeWidth: 0, r: 3 }}
            activeDot={{
              r: 5,
              stroke: "#3b82f6",
              strokeWidth: 2,
              fill: "white",
            }}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NetBalanceChart;
