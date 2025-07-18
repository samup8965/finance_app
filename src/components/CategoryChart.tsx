import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { getCategoryBreakdown } from "../data/chartDataProcessing";
import { useDataContext } from "../context/DataContext";

const CategoryChart = () => {
  const { recentTransactions } = useDataContext();
  const categoryData = getCategoryBreakdown(recentTransactions);

  // Colors for different categories
  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#84cc16",
  ];

  // Calculate total spending for percentage
  const totalSpending = categoryData.reduce(
    (sum, category) => sum + category.value,
    0
  );

  // Get top category
  const topCategory = categoryData.reduce(
    (max, category) => (category.value > max.value ? category : max),
    categoryData[0] || { name: "", value: 0 }
  );

  const topCategoryPercentage =
    totalSpending > 0 ? (topCategory.value / totalSpending) * 100 : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-600 mb-2">
          Spent by category
        </h3>
        <hr className="mb-2 border-t border-gray-200 " />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="relative w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">
                  {topCategoryPercentage.toFixed(0)}%
                </div>
                <div className="text-[10px] text-gray-500">
                  {topCategory.category}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 ml-4">
          <div className="space-y-2">
            {categoryData.slice(0, 4).map((category, index) => (
              <div
                key={category.category}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-sm text-gray-700">
                    {category.category}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  £{category.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryChart;
