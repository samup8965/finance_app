import { PracticeSideBar } from "../SideBar/SideBar";
import { useDataContext } from "../../context/DataContext";
import Overview from "./Overview";

const Dashboard = () => {
  const { connectionStatus, loaded } = useDataContext();

  // Show loading spinner while checking connection status
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

  // If connected but data is still loading, show loading spinner
  if (connectionStatus === "connected" && !loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-800">
            Loading your financial data...
          </p>
        </div>
      </div>
    );
  }

  // Show error state if connection check failed
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

  // If not connected, show the main layout (user can connect from here)
  if (connectionStatus === "disconnected") {
    return (
      <main className="grid gap-4 p-4 grid-cols-[220px_1fr] bg-stone-100">
        <PracticeSideBar />
        <Overview />
      </main>
    );
  }
  if (connectionStatus === "connected" && loaded) {
    return (
      <main className="grid gap-4 p-4 grid-cols-[220px_1fr] bg-stone-100">
        <PracticeSideBar />
        <Overview />
      </main>
    );
  }
};

export default Dashboard;
