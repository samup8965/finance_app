import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserAuth } from "../context/AuthContext.tsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type FormMode = "signin" | "reset";
const Signin = () => {
  // States

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formMode, setFormMode] = useState<FormMode>("signin");
  const [success, setSuccess] = useState(""); // success messages

  // Password visible state
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  // validation errors for sign in
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
  });

  const { signInUser, resetPassword } = UserAuth();
  const navigate = useNavigate();

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
      setLoading(false);
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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    clearMessages();
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
    setValidationErrors({ email: "", password: "" });
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

  const switchToResetMode = () => {
    setFormMode("reset");
    clearMessages();
  };

  const switchToSignInmode = () => {
    setFormMode("signin");
    clearMessages();
  };

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    // Validate email before resetting it

    const emailError = validateEmail(email);
    if (emailError) {
      setValidationErrors({ email: emailError, password: "" });
      setLoading(false);
      return;
    }
    try {
      const response = await resetPassword(email);

      if (response.success) {
        setSuccess("Password reset link sent! Check your email.");
      } else {
        setError(response.error || "Something went wrong.");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const renderSignInForm = () => (
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
          value={email}
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
        <button type="submit" className="signup-button" disabled={loading}>
          {loading ? "Signing in ..." : "Sign in"}
        </button>

        <button
          type="button"
          onClick={switchToResetMode}
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
  );

  const renderResetForm = () => (
    <form className="signup-form" onSubmit={handlePasswordReset}>
      <h2 className="signup-heading">Forgot Password</h2>
      <p className="signup-subtext">
        Enter your email address and we will send you a reset link.
      </p>
      <div>
        <input
          value={email}
          onChange={handleEmailChange}
          type="email"
          placeholder="Email"
          className="signup-input"
        />

        <button type="submit" className="signup-button" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {/* Back to Sign In Link */}
        <button
          type="button"
          onClick={switchToSignInmode}
          disabled={loading}
          className="forgot-password-link
          "
        >
          Back to Sign In
        </button>
        {error && <p className="signup-error">{error}</p>}
        {validationErrors.email && (
          <p className="signup-error">{validationErrors.email}</p>
        )}
        {success && <p className="signup-success">{success}</p>}
      </div>
    </form>
  );

  return (
    <div className="signup-container">
      {formMode === "signin" ? renderSignInForm() : renderResetForm()}
    </div>
  );
};

export default Signin;
