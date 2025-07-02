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
    <div className="signup-container">
      <form onSubmit={handlePasswordUpdate} className="signup-form">
        <h2 className="signup-heading">Reset your password</h2>
        <div>
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
            placeholder="Password"
            className="signup-input"
          />
          <div className="password-container">
            <input
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setValidationErrors({
                  password: "",
                  confirmPassword: "",
                });
                setServerError("");
              }}
              type={"password"}
              placeholder="Confirm Password"
              className="signup-input"
            />
          </div>
          <button type="submit" className="signup-button">
            Reset Password
          </button>
          {serverError && <p className="signup-error">{serverError}</p>}
          {validationErrors.password && (
            <p className="signup-error">{validationErrors.password}</p>
          )}
          {validationErrors.confirmPassword && (
            <p className="signup-error">{validationErrors.confirmPassword}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
