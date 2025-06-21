import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserAuth } from "../context/AuthContext.tsx";

const Signup = () => {
  // States

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { session, signUpNewUser } = UserAuth();
  const navigate = useNavigate();
  console.log(session);
  console.log(email, password);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signUpNewUser(email, password);

      if (result.success) {
        navigate("/dashboard");
      }
    } catch (error) {
      setError("an error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSignUp} className="signup-form">
        <h2 className="signup-heading">Sign Up</h2>
        <p className="signup-subtext">
          Already have an account?{" "}
          <Link to="/signin" className="signin-link">
            Sign in!
          </Link>
        </p>
        <div className="signup-input-group">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="signup-input"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="signup-input"
          />
          <button type="submit" className="signup-button">
            Sign Up
          </button>
          {error && <p className="signup-error">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default Signup;
