import { useDataContext } from "../../context/DataContext";

const Accountbalance = () => {
  const { accounts, isConnected } = useDataContext();
  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg max-w-6xl">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-blue-100 text-sm font-medium mb-2">
              Total Balance
            </p>
            <p className="text-4xl font-bold mb-2">
              {/**Using a ternary expression with template string to display dynamically */}

              {isConnected && accounts.length > 0
                ? `${
                    accounts[0].currency === "GBP" ? "£" : "$"
                  }${accounts[0].current_balance.toFixed(2)}`
                : isConnected
                ? "No accounts found"
                : "Connect your account"}
            </p>
            <div className="flex items-center space-x-2">
              {isConnected && accounts.length > 0 ? (
                <div className="mt-2 text-sm text-blue-100">
                  <span className="mr-4">
                    <span className="font-medium text-white">Sort Code:</span>{" "}
                    {accounts[0].sort_code}
                  </span>
                  <span>
                    <span className="font-medium text-white">
                      Account Number:
                    </span>{" "}
                    {accounts[0].account_number}
                  </span>
                </div>
              ) : (
                <span className="text-blue-100 text-sm">
                  {isConnected ? "No recent data" : ""}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accountbalance;
