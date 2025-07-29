import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { UserAuth } from "../context/AuthContext.tsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { IncomeChart } from "./Charts/EntryIncomeChart.tsx";
import { SavingsProgress } from "./Charts/EntryCategoryChart.tsx";

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

  console.log(loading);

  const { signUpNewUser } = UserAuth();

  const clearMessages = () => {
    setError("");
    setValidationErrors({ email: "", password: "" });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    clearMessages();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    clearMessages();
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    // Stops the request to Supabase
    if (emailError || passwordError) {
      setValidationErrors({
        email: emailError,
        password: passwordError,
      });
      setLoading(false);
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
      return "Password must be at least 8 characters";
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

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white px-6 py-12">
        <form onSubmit={handleSignUp} className="w-full max-w-md space-y-6">
          <h2 className="text-3xl font-bold text-black">Sign Up</h2>
          <p className="text-gray-600">
            Welcome to my personal finance tracker!
          </p>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-600 font-medium mb-3">
              Username
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
                onChange={handlePasswordChange}
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
              <p className="text-gray-500 text-sm font-medium mt-2 text-center ">
                {validationErrors.email}
              </p>
            )}

            {validationErrors.password && (
              <p className="text-gray-500 text-sm font-medium mt-2 text-center ">
                {validationErrors.password}
              </p>
            )}
          </div>

          {/* General Error */}
          {error && <p className="text-gray-500 text-sm">{error}</p>}

          <p className="text-right text-sm text-gray-600">
            Already have an account?{"   "}
            <Link
              to="/signin"
              className="text-blue-600 hover:underline font-semibold"
            >
              Sign in!
            </Link>
          </p>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
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
            Financial planning that helps you reach your goals.
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Signup;
