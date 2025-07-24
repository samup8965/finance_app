import { useDataContext } from "../../context/DataContext";
import TopBar from "./TopBar";
import Accountbalance from "./Accountbalance";
import { RecentTransactions } from "./RecentTransactions";
import MonthlySummary from "./MonthlySummary";
import RenderSavingsGoal from "./RenderSavingsGoal";

const Overview = () => {
  const { hasError, setError, showError } = useDataContext();
  // States for rendering saving goals
  console.log(hasError);

  return (
    <div className="bg-white rounded-lg pb-4 shadow h-[200vh]">
      {hasError && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-800 px-6 py-4 rounded-lg shadow-md z-50 flex items-center justify-between w-[90%] max-w-xl">
          <div className="flex items-center space-x-2">
            <span className="text-xl">⚠️</span>
            <span className="font-medium">{showError}</span>
          </div>
          <button
            onClick={() => setError(false)}
            className="ml-4 text-red-600 hover:text-red-800 transition"
          >
            ✕
          </button>
        </div>
      )}

      <TopBar />

      <div className="max-w-4xl space-y-6 px-4">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">{Accountbalance()}</div>
          <div className="lg:col-span-1">{MonthlySummary()}</div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">{RenderSavingsGoal()}</div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">{RecentTransactions()}</div>
        </section>
      </div>
    </div>
  );
};

export default Overview;
