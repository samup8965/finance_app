import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserAuth } from "../context/AuthContext.tsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// Counldnt figure out how to redirect centrally need to figure that out
import { useEffect } from "react";
import { supabase } from "../supabaseClient";

const Signup = () => {
  // States

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Authentication failures after seding request to Supabase
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
  });

  // Password visible state
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const { session, signUpNewUser } = UserAuth();

  const navigate = useNavigate();

  // Just for my sake
  console.log(session);
  console.log(email, password);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
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
      const result = await signUpNewUser(email, password);

      if (result.success) {
        setError(
          "Please check your email and click verification link to complete registration"
        );
      } else {
        setError(result.error?.message || "Sign up failed");
      }
    } catch (error) {
      setError("an error occurred");
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string) => {
    if (!email) {
      return "Email is required";
    }
    if (!email.includes("@")) {
      return "Please enter a valid email";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 8) {
      return "Password must be at least 6 characters";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one capital letter";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character";
    }
    return "";
  };

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          navigate("/dashboard");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

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
            Sign Up
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
    </div>
  );
};

export default Signup;
