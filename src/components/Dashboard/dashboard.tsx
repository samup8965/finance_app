import { PracticeSideBar } from "../SideBar/SideBar";
import { useDataContext } from "../../context/DataContext";
import { useStateContext } from "../../context/ContextProvider";
import { UserAuth } from "../../context/AuthContext";
import { useEffect } from "react";

import Overview from "./Overview";

// Rmoved the signout features for now

const Dashboard = () => {
  const { setConnected, loaded, isConnected } = useDataContext();
  const { setShouldFetchData } = useStateContext();
  const { session } = UserAuth();

  useEffect(() => {
    const checkConnection = async () => {
      const result = await checkBankConnectionStatus();
      console.log(result);
    };
    checkConnection();
  }, []);

  const checkBankConnectionStatus = async () => {
    try {
      const response = await fetch("/api/check-connection-status", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      const data = await response.json();

      if (data.isConnected) {
        setConnected(true);
        setShouldFetchData(true);
        return `There exists a connection ${JSON.stringify(data)}`;
      } else {
        setConnected(false);
        return `There does not exist a connection ${JSON.stringify(data)}`;
      }
    } catch (error) {
      setConnected(false);
    } finally {
    }
  };

  if (!isConnected) {
    return (
      <main className="grid gap-4 p-4 grid-cols-[220px_1fr] bg-stone-100">
        <PracticeSideBar />
        <Overview />
      </main>
    );
  }

  return loaded ? (
    <main className="grid gap-4 p-4 grid-cols-[220px_1fr] bg-stone-100">
      <PracticeSideBar />
      <Overview />
    </main>
  ) : (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-sm text-gray-800">Loading your data</p>
      </div>
    </div>
  );
};

export default Dashboard;
