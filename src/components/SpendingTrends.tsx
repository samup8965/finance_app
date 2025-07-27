import IncomeChart from "./Charts/IncomeChart";
import ExpensesChart from "./Charts/ExpensesChart";
import NetBalanceChart from "./Charts/NetBalanceChart";
import CategoryChart from "./Charts/CategoryChart";
import { PracticeSideBar } from "./SideBar/SideBar";

export const SpendingTrends = () => {
  return (
    <main className="grid gap-4 p-4 grid-cols-[220px_1fr] bg-stone-100">
      <PracticeSideBar />

      <div className="bg-white rounded-xl shadow-md p-6 max-w-6xl">
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
    </main>
  );
};
