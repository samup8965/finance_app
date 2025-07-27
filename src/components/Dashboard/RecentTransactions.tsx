import { useDataContext } from "../../context/DataContext";
import { useNavigate } from "react-router-dom";
import { type CategoryKey } from "../../types/CategoryKey";
import { categoryIcons } from "../../assets/Icons";

export const RecentTransactions = () => {
  const { recentTransactions, connectionStatus } = useDataContext();
  const navigate = useNavigate();
  return (
    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Recent Transactions
          </h3>
          <p className="text-sm text-gray-500">
            {connectionStatus === "connected"
              ? "A snapshot of your latest activity"
              : "Connect your account to view transactions"}
          </p>
        </div>
        {connectionStatus === "connected" && recentTransactions.length > 0 && (
          <button
            className="text-sm font-medium text-blue-600 hover:underline"
            onClick={() => navigate("/transactions")}
          >
            View all
          </button>
        )}
      </div>

      {connectionStatus === "connected" && recentTransactions.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {recentTransactions.slice(0, 4).map((transaction, index) => (
            <li key={index} className="py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Circle Icon with initials or category */}
                <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                  {/* We use as CategoryKey because we know its one of those we*/}
                  {categoryIcons[
                    transaction.transaction_category as CategoryKey
                  ] ?? categoryIcons.UNKNOWN}
                </div>

                {/* Transaction Info */}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(transaction.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div className="text-right">
                <p
                  className={`text-sm font-semibold ${
                    transaction.amount > 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {transaction.amount > 0 ? "+" : "-"}£
                  {Math.abs(transaction.amount).toFixed(2)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-2xl">
              {connectionStatus === "connected" ? "📄" : "🔗"}
            </span>
          </div>
          <p className="text-gray-600 font-medium">
            {connectionStatus === "connected"
              ? "Your transactions will appear here"
              : "Link your bank account to view transactions"}
          </p>
        </div>
      )}
    </div>
  );
};
