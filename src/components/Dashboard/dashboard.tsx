import { PracticeSideBar } from "../SideBar/SideBar";
import { useDataContext } from "../../context/DataContext";
import { useStateContext } from "../../context/ContextProvider";
import { UserAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";

import Overview from "./Overview";

// Rmoved the signout features for now

const Dashboard = () => {
  const [checkingConnection, setCheckingConnection] = useState(false);
  const { setConnected } = useDataContext();
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
    setCheckingConnection(true);
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
      setCheckingConnection(false);
    }
  };

  return checkingConnection ? (
    <div>Loading your information</div>
  ) : (
    <main className="grid gap-4 p-4 grid-cols-[220px_1fr] bg-stone-100">
      <PracticeSideBar />
      <Overview />
    </main>
  );
};

export default Dashboard;
