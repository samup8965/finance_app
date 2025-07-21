import IncomeChart from "../components/IncomeChart";
import ExpensesChart from "../components/ExpensesChart";
import NetBalanceChart from "../components/NetBalanceChart";
import CategoryChart from "../components/CategoryChart";

export const SpendingTrends = () => {
  return (
    <div className="p-6 bg-blue-150 min-h-screen">
      <div className="bg-gray-50 rounded-xl shadow-md p-6 max-w-6xl mx-auto">
        {/* Main Net Worth Chart - Full Width */}
        <div className="mb-6">
          <NetBalanceChart />
        </div>

        {/* Bottom Row - Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Income and Expenses Charts */}
          <div className="space-y-6">
            <IncomeChart />
            <ExpensesChart />
          </div>

          {/* Right Column - Category Chart */}
          <div className="lg:col-span-1">
            <CategoryChart />
          </div>
        </div>
      </div>
    </div>
  );
};
