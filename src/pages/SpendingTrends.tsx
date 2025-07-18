import IncomeChart from "../components/IncomeChart";
import ExpensesChart from "../components/ExpensesChart";
import NetBalanceChart from "../components/NetBalanceChart";
import CategoryChart from "../components/CategoryChart";
import { useStateContext } from "../context/ContextProvider";

import { Navbar } from "../components/Navbar";
import { SideBar } from "../components/SideBar";

export const SpendingTrends = () => {
  const { activeMenu } = useStateContext();

  const SpendingTrendsWrapper = () => {
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

  return (
    <div className="flex relative dark:bg-main-dark-bg">
      {/* Sidebar */}
      {activeMenu ? (
        <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white text-black">
          <SideBar />
        </div>
      ) : (
        <div className="w-0 dark:bg-secondary-dark-bg">
          <SideBar />
        </div>
      )}

      {/*Nav bar*/}
      <div
        className={
          activeMenu
            ? "dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  "
            : "bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 "
        }
      >
        <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
          <Navbar />
        </div>
        <div className="m-3 p-5">
          <SpendingTrendsWrapper />
        </div>
      </div>
    </div>
  );
};
