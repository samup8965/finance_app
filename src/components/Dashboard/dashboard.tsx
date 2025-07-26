import { PracticeSideBar } from "../SideBar/SideBar";
import { useDataContext } from "../../context/DataContext";
import { useStateContext } from "../../context/ContextProvider";
import { UserAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";

import Overview from "./Overview";

const Dashboard = () => {
  const { setConnected, loaded, isConnected } = useDataContext();
  const { setShouldFetchData } = useStateContext();
  const { session } = UserAuth();
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      if (!session?.access_token) {
        setIsCheckingConnection(false);
        return;
      }

      try {
        setIsCheckingConnection(true);
        const result = await checkBankConnectionStatus();
        console.log(result);
      } finally {
        setIsCheckingConnection(false);
      }
    };

    checkConnection();
  }, [session?.access_token]);

  const checkBankConnectionStatus = async () => {
    try {
      const response = await fetch("/api/check-connection-status", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.isConnected) {
        setConnected(true);
        setShouldFetchData(true);
        return `There exists a connection ${JSON.stringify(data)}`;
      } else {
        setConnected(false);
        setShouldFetchData(false);
        return `There does not exist a connection ${JSON.stringify(data)}`;
      }
    } catch (error) {
      console.error("Error checking connection status:", error);
      setConnected(false);
      setShouldFetchData(false);
      throw error;
    }
  };

  // Show loading spinner while checking connection status
  if (isCheckingConnection) {
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

  // If not connected, show the main layout (user can connect from here)
  if (!isConnected) {
    return (
      <main className="grid gap-4 p-4 grid-cols-[220px_1fr] bg-stone-100">
        <PracticeSideBar />
        <Overview />
      </main>
    );
  }

  // If connected but data is still loading, show loading spinner
  if (isConnected && !loaded) {
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

  // If connected and data is loaded, show the main layout
  return (
    <main className="grid gap-4 p-4 grid-cols-[220px_1fr] bg-stone-100">
      <PracticeSideBar />
      <Overview />
    </main>
  );
};

export default Dashboard;
