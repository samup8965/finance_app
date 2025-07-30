// This component handles the URL parameters and extratcs the code
// Sends to backend for the token exchange

import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDataContext } from "../context/DataContext";
import { UserAuth } from "../context/AuthContext";

export const TrueLayerCallback = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams(); // Get the code parameters

  // Need the session user id to prove who the user is before sending a request

  const { session, loading } = UserAuth();

  const { connectionStatus, loaded, refreshData } = useDataContext();

  const hasExchangedCode = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      if (!session || hasExchangedCode.current) return;

      console.log(session);
      const token = session?.access_token;
      console.log(token);

      const code = searchParams.get("code");
      const error = searchParams.get("error");

      if (error) {
        console.error("TrueLayer error:", error);
        navigate("/dashboard");
        return;
      }

      if (code && !hasExchangedCode.current) {
        hasExchangedCode.current = true;
        try {
          // Send code to your backend to exchange for tokens
          const response = await fetch("/api/exchange-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ code }),
          });

          const data = await response.json();

          if (response.ok) {
            // Sucess need to store access tokens
            console.log("Sucessful", data); // For now print
            setSearchParams({});

            await refreshData();
          } else {
            console.error("Token exchange failed", data);
            setSearchParams({});
            navigate("/dashboard");
          }
        } catch (error) {
          console.error("Network error during token exchange");
          setSearchParams({});
          navigate("/dashboard");
        }
      }
    };

    // Need to wait for session to be ready

    if (!loading) {
      if (session) {
        handleCallback();
      } else {
        navigate("/signup");
      }
    }
  }, [loading, session, searchParams]);

  // Handling sucessful navigation only after connection and loaded data
  useEffect(() => {
    if (loaded && connectionStatus === "connected") {
      navigate("/dashboard");
    }

    if (connectionStatus === "error") {
      navigate("/dashboard");
    }
  }, [connectionStatus, loaded]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.warn("Connection timeout - redirecting to dashboard");
      navigate("/dashboard");
    }, 20000); // 20 seconds timeout

    return () => clearTimeout(timeoutId);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-lg text black">
          Connecting your bank account...
        </p>
        <p className="text-sm text-gray-800">
          Please wait while we process your connection.
        </p>
      </div>
    </div>
  );
};
