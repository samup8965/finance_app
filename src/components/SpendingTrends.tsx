import IncomeChart from "./Charts/IncomeChart";
import ExpensesChart from "./Charts/ExpensesChart";
import NetBalanceChart from "./Charts/NetBalanceChart";
import CategoryChart from "./Charts/CategoryChart";
import { PracticeSideBar } from "./SideBar/SideBar";
import { useDataContext } from "../context/DataContext";

export const SpendingTrends = () => {
  const { connectionStatus, loaded } = useDataContext();

  if (connectionStatus === "checking") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-800">
            Checking connection status...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (connectionStatus === "error") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-sm text-gray-800">
            Unable to check connection status. Please refresh the page.
          </p>
        </div>
      </div>
    );
  }

  // Data loading state (connected but data not loaded yet)
  if (connectionStatus === "connected" && !loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-800">
            Loading your financial summary...
          </p>
        </div>
      </div>
    );
  }

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
