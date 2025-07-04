import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserAuth } from "../context/AuthContext.tsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { useEffect } from "react";
import { supabase } from "../supabaseClient";

const Signin = () => {
  // States

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  console.log(loading);

  // New states for password reset flow
  const [showResetForm, setShowResetForm] = useState<Boolean>(false);
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState(""); // success messages

  // Password visible state
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  // validation errors for sign in
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
  });

  const { session, signInUser, resetPassword } = UserAuth();
  const navigate = useNavigate();
  console.log(session);
  console.log(email, password);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setValidationErrors({
      email: emailError,
      password: passwordError,
    });

    // Stops the request to Supabase
    if (emailError || passwordError) {
      return;
    }

    try {
      const result = await signInUser(email, password);

      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Sign up failed");
      }
    } catch (error) {
      setError("an error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // minimal validation as it has already been validated
  const validateEmail = (email: string) => {
    if (!email) {
      return "Email is required";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return "Password is required";
    }
    return "";
  };

  // Function to switch to reset form
  const showForgotPassword = () => {
    setShowResetForm(true);
    setError("");
    setValidationErrors({
      email: "",
      password: "",
    });
    setSuccess("");
  };
  // Function to switch back to sign in form
  const showSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowResetForm(false);
    setError("");
    setValidationErrors({
      email: "",
      password: "",
    });
    setSuccess("");
  };

  const handleSendResetLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResetLoading(true);
    setError("");
    setSuccess("");

    const response = await resetPassword(email);

    if (response.success) {
      setSuccess("Password reset link sent! Check your email.");
    } else {
      setError(response.error || "Something went wrong.");
    }

    setResetLoading(false);
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        navigate("/dashboard");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="signup-container">
      {!showResetForm ? (
        <form onSubmit={handleSignIn} className="signup-form">
          <h2 className="signup-heading">Sign In</h2>
          <p className="signup-subtext">
            Dont have an account?{" "}
            <Link to="/signup" className="signin-link">
              Sign up!
            </Link>
          </p>
          <div>
            <input
              onChange={(e) => {
                setEmail(e.target.value);
                setValidationErrors({
                  email: "",
                  password: "",
                });
                setError("");
              }}
              type="email"
              placeholder="Email"
              className="signup-input"
            />
            <div className="password-container">
              <input
                onChange={(e) => {
                  setPassword(e.target.value);
                  setValidationErrors({
                    email: "",
                    password: "",
                  });
                  setError("");
                }}
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                className="signup-input"
              />
              <i className="eye-icon" onClick={handlePasswordVisibility}>
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </i>
            </div>
            <button type="submit" className="signup-button">
              Sign in
            </button>

            <button
              type="button"
              onClick={showForgotPassword}
              className="forgot-password-link"
            >
              Forgot Password?
            </button>

            {error && <p className="signup-error">{error}</p>}
            {validationErrors.email && (
              <p className="signup-error">{validationErrors.email}</p>
            )}
            {validationErrors.password && (
              <p className="signup-error">{validationErrors.password}</p>
            )}
          </div>
        </form>
      ) : (
        <form className="signup-form" onSubmit={handleSendResetLink}>
          <h2 className="signup-heading">Forgot Password</h2>
          <p className="signup-subtext">
            Enter your email address and we will send you a reset link.
          </p>
          <div>
            <input type="email" placeholder="Email" className="signup-input" />

            <button
              type="submit"
              className="signup-button"
              disabled={resetLoading}
            >
              {resetLoading ? "Sending..." : "Send Reset Link"}
            </button>

            {/* Back to Sign In Link */}
            <button
              type="button"
              onClick={showSignIn}
              className="forgot-password-link"
            >
              Back to Sign In
            </button>

            {error && <p className="signup-error">{error}</p>}
            {success && <p className="signup-success">{success}</p>}
          </div>
        </form>
      )}
    </div>
  );
};

export default Signin;
