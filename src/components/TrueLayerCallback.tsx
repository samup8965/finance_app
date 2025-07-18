// This component handles the URL parameters and extratcs the code
// Sends to backend for the token exchange

import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import { useDataContext } from "../context/DataContext";

export const TrueLayerCallback = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams(); // Get the code parameters

  const { setShouldFetchData } = useStateContext();
  const { isConnected, setConnected, loaded, setError, setShowError } =
    useDataContext();

  const hasExchangedCode = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");

      console.log("Redirect received code:", code);
      console.log("Redirect received error:", error);

      if (error) {
        // for now just print it
        setShowError("There has been an error on TrueLayers side");
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
            },
            body: JSON.stringify({ code }),
          });

          const data = await response.json();

          if (response.ok) {
            // Sucess need to store access tokens
            setConnected(true);
            console.log("Sucessful", data); // For now print

            setSearchParams({});
            console.log("True layer setting fetch on for account and balances");
            setShouldFetchData(true);
          } else {
            setShowError("Token exhange failed. Please try again!");
            setConnected(false);
            setError(true);
            setSearchParams({});
            navigate("/dashboard");
          }
        } catch (error) {
          setShowError("Network error. Please try again");
          setConnected(false);
          setError(true);

          setSearchParams({});
          navigate("/dashboard");
        }
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  // Handling sucessful navigation only after connection and loaded data
  useEffect(() => {
    if (loaded && isConnected) {
      navigate("/dashboard");
    }

    // Only set timeout if we're connected but not loaded yet
    if (isConnected && !loaded) {
      const timeoutId = setTimeout(() => {
        setShowError("Connection is taking too long. Please try again.");
        navigate("/dashboard");
      }, 20000); // 20 seconds timeout

      // Cleanup timeout if component unmounts or dependencies change
      return () => clearTimeout(timeoutId);
    }
  }, [loaded, isConnected]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-lg">Connecting your bank account...</p>
        <p className="text-sm text-gray-600">
          Please wait while we process your connection.
        </p>
      </div>
    </div>
  );
};
