import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserAuth } from "../context/AuthContext.tsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { IncomeChart } from "./Charts/EntryIncomeChart.tsx";
import { SavingsProgress } from "./Charts/EntryCategoryChart.tsx";

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
    <form onSubmit={handleSignIn} className="w-full max-w-md space-y-6">
      <h2 className="text-3xl font-bold text-black">Sign In</h2>

      <p className="text-gray-600">Welcome back! Please enter your details.</p>

      {/* Email */}
      <div>
        <label className="block text-sm text-gray-600 font-medium mb-3">
          Email
        </label>
        <input
          value={email}
          onChange={handleEmailChange}
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
          disabled={loading}
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm text-gray-600 font-medium mb-3">
          Password
        </label>
        <div className="relative">
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setValidationErrors({ email: "", password: "" });
              setError("");
            }}
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            className="w-full px-4 py-3 text-gray-600 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
            onClick={handlePasswordVisibility}
          >
            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        {validationErrors.email && (
          <p className="text-gray-500 text-sm font-medium mt-2 text-center">
            {validationErrors.email}
          </p>
        )}
        {validationErrors.password && (
          <p className="text-gray-500 text-sm font-medium mt-2 text-center">
            {validationErrors.password}
          </p>
        )}
      </div>

      {/* General Error */}
      {error && <p className="text-gray-500 text-sm text-center">{error}</p>}

      {/* Forgot password */}
      <button
        type="button"
        onClick={switchToResetMode}
        className="text-blue-600 hover:underline font-semibold text-sm"
      >
        Forgot Password?
      </button>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <p className="text-gray-600 text-center">
        Don’t have an account?{" "}
        <Link
          to="/signup"
          className="text-blue-600 hover:underline font-semibold"
        >
          Sign up!
        </Link>
      </p>
    </form>
  );

  const renderResetForm = () => (
    <form className="w-full max-w-md space-y-6" onSubmit={handlePasswordReset}>
      <h2 className="text-3xl font-bold text-black">Forgot Password</h2>
      <p className="text-gray-600">
        Enter your email address and we’ll send you a reset link.
      </p>

      <div>
        <label className="block text-sm text-gray-600 font-medium mb-3">
          Email
        </label>
        <input
          value={email}
          onChange={handleEmailChange}
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
          disabled={loading}
        />

        {validationErrors.email && (
          <p className="text-gray-500 text-sm font-medium mt-2 text-center">
            {validationErrors.email}
          </p>
        )}
        {error && <p className="text-gray-500 text-sm text-center">{error}</p>}
        {success && (
          <p className="text-green-600 text-sm font-medium text-center">
            {success}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>

      <button
        type="button"
        onClick={switchToSignInmode}
        disabled={loading}
        className="text-blue-600 hover:underline font-semibold text-sm"
      >
        Back to Sign In
      </button>
    </form>
  );

  return (
    <div className="flex min-h-screen">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white px-6 py-12">
        {formMode === "signin" ? renderSignInForm() : renderResetForm()}
      </div>

      {/* Right Section */}
      <div className="hidden md:flex w-1/2 flex-col justify-center items-center bg-blue-600 text-white p-10">
        <div className="relative w-full max-w-md">
          <IncomeChart />

          <div className="absolute -bottom-25 -right-25">
            <div className="relative">
              <SavingsProgress />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-black font-bold text-sm leading-tight">
                <div className="text-xl">60%</div>
                <div>Total savings</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-35">
          <h3 className="text-2xl font-bold text-center">
            Financial clarity, one goal at a time.
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Signin;
