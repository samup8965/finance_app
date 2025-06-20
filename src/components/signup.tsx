import React from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="signup-container">
      <form className="signup-form">
        <h2 className="signup-heading">Sign Up</h2>
        <p className="signup-subtext">
          Already have an account?{" "}
          <Link to="/signin" className="signin-link">
            Sign in!
          </Link>
        </p>
        <div className="signup-input-group">
          <input type="email" placeholder="Email" className="signup-input" />
          <input
            type="password"
            placeholder="Password"
            className="signup-input"
          />
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
