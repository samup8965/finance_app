import { useDataContext } from "../context/DataContext";
import { categoryIcons } from "../assets/Icons";
import { type CategoryKey } from "../types/CategoryKey";
import { useStateContext } from "../context/ContextProvider";
import { Navbar } from "../components/Navbar";
import { SideBar } from "../components/SideBar";

export const RecurringPayments = () => {
  const { activeMenu } = useStateContext();
  const { recurringPayments, directDebits, standingOrders, isConnected } =
    useDataContext();
  const RecurringPaymentsWrapper = () => {
    let filtered_list = recurringPayments;

    if (directDebits.length === 0) {
      filtered_list = recurringPayments.filter(
        (p) => p.type === "STANDING_ORDER"
      );
    } else if (standingOrders.length === 0) {
      filtered_list = recurringPayments.filter(
        (p) => p.type === "DIRECT_DEBIT"
      );
    }

    return (
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl mx-auto p-6 my-8 min-h-[600px]">
        <div>
          {/* Header Section */}
          <div className="px-8 py-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-black">
              Recurring Payments
            </h2>
            <p className="text-sm text-gray-500">
              {isConnected
                ? "All your activity"
                : "Connect your account to view recurring payments"}
            </p>
          </div>

          {/* Content Section */}
          <div className="px-8 py-6 overflow-hidden max-h-96 overflow-y-auto pr-2 -mr-2">
            {!isConnected && recurringPayments.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <span className="text-gray-400 text-3xl">
                    {isConnected ? "📄" : "🔗"}
                  </span>
                </div>
                <div className="max-w-sm mx-auto space-y-2">
                  <p className="text-gray-900 font-medium text-base">
                    {isConnected
                      ? "No recurring payments"
                      : "Connect your bank account"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {isConnected
                      ? "Your recurring payments will appear here once you start some subscriptions"
                      : "Link your bank account to view and track your recurring payments"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-h-full flex-shrink-0">
                {recurringPayments[0].total && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <p className="text-sm font-medium text-blue-900">
                      Total recurring payments: {recurringPayments[0].total}
                    </p>
                  </div>
                )}

                {filtered_list.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Enhanced Icon Container */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                        {categoryIcons[account.type as CategoryKey] ??
                          categoryIcons.UNKNOWN}
                      </div>

                      {/* Payment Info */}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {account.payee_name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {account.type === "direct_debit"
                            ? "Direct Debit"
                            : "Standing Order"}
                          {account.last_payed && (
                            <>
                              {" • Last paid on "}
                              {new Date(account.last_payed).toLocaleDateString(
                                "en-GB",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Enhanced Amount Display */}
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-red-500">
                        -£{Math.abs(account.amount).toFixed(2)}
                      </p>
                      {account.status && (
                        <p
                          className={`text-xs mt-1 ${
                            account.status.toLowerCase() === "active"
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {account.status}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
          <RecurringPaymentsWrapper />
        </div>
      </div>
    </div>
  );
};
