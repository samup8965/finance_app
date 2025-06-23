import Signup from "./components/signup";

import { useEffect } from "react";
import { UserAuth } from "./context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";

function App() {
  const { session } = UserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user just got authenticated (from email verification), redirect to dashboard
    if (session) {
      navigate("/dashboard");
    }
  }, [session]);

  return (
    <div>
      <Signup />
    </div>
  );
}

export default App;
