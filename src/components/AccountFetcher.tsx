import { useEffect } from "react";

const AccountFetcher = () => {
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch("/api/balance", {
          method: "GET",
          credentials: "include", // for cookies
        });

        const data = await response.json();

        if (!response.ok) {
          console.error(" Failed to fetch accounts:", data);
          return;
        }

        console.log("Accounts data", data);
      } catch (err) {
        console.error("Network error: err");
      }
    };

    fetchAccounts();
  }, []);
  return (
    <div className="p-4 text-center">
      <p className="text-gray-600">
        Fetching accounts... Check console for results.
      </p>
    </div>
  );
};

export default AccountFetcher;
