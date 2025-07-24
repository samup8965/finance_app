import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "./context/AuthContext";

function App() {
  const { session, loading } = UserAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (session) {
        navigate("/dashboard");
      } else {
        navigate("/signup");
      }
    }
  }, [session, loading]);

  return null; // Router will handle what to show
}
export default App;
