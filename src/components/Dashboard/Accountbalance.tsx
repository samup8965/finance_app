import { useDataContext } from "../../context/DataContext";
import { getMonthlyBalance } from "../../data/chartDataProcessing";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";

const Accountbalance = () => {
  const { accounts, connectionStatus, recentTransactions } = useDataContext();

  // Get the monthly balance data
  const monthlyData = getMonthlyBalance(recentTransactions);

  // Find current month to highlight it
  const currentMonth = new Date().getMonth();
  const monthNames = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  return (
    <div className=" to-white p-6 rounded-lg shadow h-[300px]">
      <div className="bg-white rounded-2xl p-6 shadow-sm border bg-gradient-to-br from-blue-200 via-white-100 border-gray-100  flex flex-col h-[250px]">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Balance</p>
            <p className="text-3xl font-bold text-gray-900">
              {connectionStatus === "connected" && accounts.length > 0
                ? `${
                    accounts[0].currency === "GBP" ? "£" : "$"
                  }${accounts[0].current_balance.toLocaleString()}`
                : connectionStatus === "connected"
                ? "No accounts found"
                : "Connect your account"}
            </p>
          </div>
          {connectionStatus === "connected" && (
            <span className="text-black text-sm font-medium">
              <p>{accounts[0].sort_code}</p>
              <p>{accounts[0].account_number}</p>
            </span>
          )}
        </div>

        {/* Chart */}
        {connectionStatus === "connected" && accounts.length > 0 ? (
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
              >
                {/* X Axis */}
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                />

                {/* Y Axis with 100s steps but visually hidden */}
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, (dataMax) => Math.ceil(dataMax / 100) * 100]}
                />

                {/* Bars */}
                <Bar dataKey="balance" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {monthlyData.map((entry, index) => {
                    const isCurrentMonth =
                      entry.month.slice(0, 3).toUpperCase() ===
                      monthNames[currentMonth];
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={isCurrentMonth ? "#0A2540" : "#808080"}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-gray-400 text-xl">📊</span>
              </div>
              <p className="text-gray-500 text-sm">
                {connectionStatus === "connected"
                  ? "No balance data available"
                  : "Connect to view balance history"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accountbalance;
