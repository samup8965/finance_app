import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", income: 1000 },
  { month: "Feb", income: 1400 },
  { month: "Mar", income: 1100 },
  { month: "Apr", income: 1600 },
  { month: "May", income: 1200 },
  { month: "Jun", income: 1800 },
];

export const IncomeChart = () => (
  <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
    <h3 className="text-lg font-semibold text-gray-700 mb-4">Total Income</h3>
    <ResponsiveContainer width="100%" height={200}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
      >
        <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} />
        <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="income"
          stroke="#ff9f43"
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
