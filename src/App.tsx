import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "./context/AuthContext";

function App() {
  const { session, loading } = UserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (session) {
        console.log("To dashboard");
        navigate("/dashboard");
      } else {
        console.log("To signup");
        navigate("/signup");
      }
    }
  }, [session, loading]);

  if (loading) {
    return <div>Loading your finance tracker...</div>;
  }

  return null; // Router will handle what to show
}
export default App;
