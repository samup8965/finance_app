// This component handles the URL parameters and extratcs the code
// Sends to backend for the token exchange

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const TrueLayerCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Get the code parameters

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");

      if (error) {
        // for now just print it
        console.error("TrueLayer error", error);
        navigate("/dashboard");
        return;
      }

      if (code) {
        try {
          // Send code to your backend to exchange for tokens
          const response = await fetch(
            "https://finance-app-3iyk.vercel.app/api/exchange-token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ code }),
            }
          );

          const data = await response.json();

          if (response.ok) {
            // Sucess need to store access tokens
            console.log("Sucessful" + data); // For now print

            navigate("/dashboard");
          } else {
            console.error("Token exhange failed:", data);
            navigate("/dashboard");
          }
        } catch (error) {
          console.error("Network error:", error);
          navigate("/dashboard");
        }
      }
    };

    handleCallback();
  }, [searchParams]);

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
