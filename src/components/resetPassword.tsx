import React from "react";
import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

import { useEffect } from "react";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    password: "",
    confirmPassword: "",
  });
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

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

  const checkPassword = (password: string) => {
    if (!password) {
      return "Password is required";
    }
    if (newPassword !== password) {
      return "Passwords do not match";
    } else {
      return "";
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const passwordError = validatePassword(newPassword);
    const checkError = checkPassword(confirmPassword);

    setValidationErrors({
      password: passwordError,
      confirmPassword: checkError,
    });

    if (passwordError || checkError) {
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setServerError(error.message);
      } else {
        navigate("/signin");
      }
    } catch (error) {
      setServerError("An unexpected error has occured");
    }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "USER_UPDATED") {
        navigate("/signin");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen justify-center items-center bg-white px-6 py-12">
      <form
        onSubmit={handlePasswordUpdate}
        className="w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl font-bold text-black">Reset your password</h2>
        <p className="text-gray-600">Enter your new password below.</p>

        {/* New Password */}
        <div>
          <label className="block text-sm text-gray-600 font-medium mb-3">
            New Password
          </label>
          <input
            onChange={(e) => {
              setNewPassword(e.target.value);
              setValidationErrors({
                password: "",
                confirmPassword: "",
              });
              setServerError("");
            }}
            type="password"
            placeholder="New Password"
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm text-gray-600 font-medium mb-3">
            Confirm Password
          </label>
          <input
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setValidationErrors({
                password: "",
                confirmPassword: "",
              });
              setServerError("");
            }}
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
          />
        </div>

        {/* Validation Errors */}
        {validationErrors.password && (
          <p className="text-gray-500 text-sm font-medium text-center">
            {validationErrors.password}
          </p>
        )}
        {validationErrors.confirmPassword && (
          <p className="text-gray-500 text-sm font-medium text-center">
            {validationErrors.confirmPassword}
          </p>
        )}

        {/* Server Error */}
        {serverError && (
          <p className="text-gray-500 text-sm font-medium text-center">
            {serverError}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
