import { useDataContext } from "../context/DataContext";
import { type Transaction } from "../context/DataContext";
import { categoryIcons } from "../assets/Icons";
import { type CategoryKey } from "../types/CategoryKey";
import { SideBar } from "./SideBar";
import { useStateContext } from "../context/ContextProvider";
import { Navbar } from "./Navbar";
import { useState, useEffect } from "react";

const Transactions = () => {
  const { activeMenu } = useStateContext();

  const Alltransactions = () => {
    const { recentTransactions, isConnected } = useDataContext();

    // States for search bar
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredTransactions, setFilteredTransactions] =
      useState<Transaction[]>(recentTransactions);
    const [sortOption, setSortOption] = useState<string>("date-desc");

    const searchTransactions = (
      transactions: Transaction[],
      searchTerm: string
    ) => {
      // If nothing is there just show the entire list
      if (!searchTerm.trim()) {
        return transactions;
      }

      const lowerSearchTerm = searchTerm.toLowerCase();

      return transactions.filter((transaction) => {
        // Searching in description (case insensitive, partial match)
        const descriptionMatch = transaction.description
          .toLowerCase()
          .includes(lowerSearchTerm);

        // Search in amount (handle pound symbols and decimals)

        const amountString = Math.abs(transaction.amount).toString();
        const amountMatch = amountString.includes(lowerSearchTerm);

        return descriptionMatch || amountMatch;
      });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);
    };

    const sortTransactions = (
      transactions: Transaction[],
      sortOption: string
    ): Transaction[] => {
      // Take original list
      const sorted = [...transactions]; //Clone not to affect the original list

      switch (sortOption) {
        case "date-desc":
          return sorted.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

        case "date-asc":
          return sorted.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );

        case "amount-desc":
          return sorted.sort((a, b) => {
            const diff = Math.abs(b.amount) - Math.abs(a.amount);
            if (diff !== 0) {
              return diff;
            }
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });

        case "amount-asc":
          return sorted.sort((a, b) => {
            const diff = Math.abs(a.amount) - Math.abs(b.amount);
            if (diff !== 0) {
              return diff;
            }
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          });

        default:
          return sorted;
      }
    };
    // To know which option in the drop down
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSortOption(e.target.value);
    };

    // Activate sort when user changes dropdown or transactions/search changes

    useEffect(() => {
      const timeOutId = setTimeout(() => {
        const filtered = searchTransactions(recentTransactions, searchTerm);
        const sorted = sortTransactions(filtered, sortOption);
        setFilteredTransactions(sorted);
      }, 300);

      return () => clearTimeout(timeOutId);
    }, [searchTerm, sortOption, recentTransactions]);

    return (
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl mx-auto p-6 my-8 min-h-[600px]">
        {/* Header Section */}
        <div className="px-8 py-6 border-b border-gray-50">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="text-xl font-semibold text-gray-900">
                All Transactions
              </h3>
              <p className="text-sm text-gray-500">
                {isConnected
                  ? "All your activity"
                  : "Connect your account to view transactions"}
              </p>
            </div>
            {isConnected && recentTransactions.length > 0 && (
              <div className="flex items-center space-x-3">
                <select
                  value={sortOption}
                  onChange={handleSortChange}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                >
                  <option value="date-desc">Latest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="amount-desc">Highest Amount</option>
                  <option value="amount-asc">Lowest Amount</option>
                </select>

                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    className="w-48 px-3 py-2 text-sm border border-gray-200 rounded-lg  focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="">🔍</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="px-8 py-6 overflow-hidden max-h-96 overflow-y-auto pr-2 -mr-2">
          {isConnected && recentTransactions.length > 0 ? (
            <div className="space-y-4  max-h-full flex-shrink-0">
              {filteredTransactions.map((transaction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    {/* Enhanced Icon Container */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                      {categoryIcons[
                        transaction.transaction_category as CategoryKey
                      ] ?? categoryIcons.UNKNOWN}
                    </div>

                    {/* Transaction Info */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(transaction.date).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Amount Display */}
                  <div className="text-right shrink-0">
                    <p
                      className={`text-sm font-semibold ${
                        transaction.amount > 0
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : "-"}£
                      {Math.abs(transaction.amount).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <span className="text-gray-400 text-3xl">
                  {isConnected ? "📄" : "🔗"}
                </span>
              </div>
              <div className="max-w-sm mx-auto space-y-2">
                <p className="text-gray-900 font-medium text-base">
                  {isConnected
                    ? "No transactions yet"
                    : "Connect your bank account"}
                </p>
                <p className="text-gray-500 text-sm">
                  {isConnected
                    ? "Your transactions will appear here once you start spending"
                    : "Link your bank account to view and track your transactions"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex relative dark:bg-main-dark-bg">
      {/* Sidebar */}
      {activeMenu ? (
        <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white text-black">
          <SideBar />
        </div>
      ) : (
        <div className="w-0 dark:bg-secondary-dark-bg">
          <SideBar />
        </div>
      )}

      {/*Nav bar*/}
      <div
        className={
          activeMenu
            ? "dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  "
            : "bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 "
        }
      >
        <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
          <Navbar />
        </div>
        <div className="m-3 p-5">
          <Alltransactions />
        </div>
      </div>
    </div>
  );
};

export default Transactions;
