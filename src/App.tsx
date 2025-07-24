import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "./context/AuthContext";
import { useDataContext } from "./context/DataContext";
import { useStateContext } from "./context/ContextProvider";

function App() {
  const { session, loading } = UserAuth();
  const { setConnected } = useDataContext();
  const { setShouldFetchData } = useStateContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (session) {
        checkBankConnectionStatus();

        navigate("/dashboard");
      } else {
        navigate("/signup");
      }
    }
  }, [session, loading]);

  const checkBankConnectionStatus = async () => {
    try {
      const response = await fetch("/api/check-connection-status", {
        method: "GET",
        headers: {
          Authorization: `Bearer${session?.access_token}`,
        },
      });
      const data = await response.json();
      if (data.isConnected) {
        setConnected(true);
        setShouldFetchData(true);
      }
    } catch (error) {
      setConnected(false);
    }
  };

  if (loading) {
    return <div>Loading your finance tracker...</div>;
  }

  return null; // Router will handle what to show
}
export default App;
