import React from "react";

import { earningData } from "../data/earningData";

const Overview = () => {
  return (
    <div className="container mx-auto mt-12 px-4">
      {/* Account Balance Card */}
      <div className="flex flex-wrap justify-start mb-6">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-xl min-h-[11rem] w-full md:w-[30rem] p-6 pt-9 m-1 shadow-sm bg-hero-pattern bg-no-repeat bg-cover bg-center">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-gray-800 dark:text-gray-500">
                Account Balance
              </p>
              <p className="text-2xl font-semibold">$1,000</p>
            </div>
            <p className="text-sm text-gray-500 mt-1">+2.5% from last month</p>
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid gap-6 max-w-4xl ">
        {/* Recent Transactions */}
        <div className="bg-white dark:bg-secondary-dark-bg rounded-xl p-6 shadow-lg">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Recent Transactions
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Latest activity
            </p>
          </div>

          <div className="space-y-3">
            {earningData.slice(0, 3).map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{
                      backgroundColor: item.iconBg,
                      color: item.iconColor,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {index === 0
                        ? "Today, 2:30 PM"
                        : index === 1
                        ? "Yesterday, 9:00 AM"
                        : "Dec 28, 11:45 PM"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`font-medium ${
                      item.percentage.startsWith("+")
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {item.percentage.startsWith("+") ? "+" : "-"}${item.amount}
                  </span>
                  <p
                    className={`text-xs ${
                      item.pcColor.startsWith("green")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.percentage}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
              View All Transactions ({earningData.length} total)
            </button>
          </div>
        </div>

        {/* Two Chart Components Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Circle Chart Placeholder */}
          <div className="h-48 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-200 dark:bg-purple-700 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600 dark:text-purple-300 text-2xl">
                  🍩
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                Circle Chart
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Expense breakdown
              </p>
            </div>
          </div>

          {/* Line Chart Placeholder */}
          <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-200 dark:bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 dark:text-blue-300 text-2xl">
                  📈
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                Line Chart
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Balance trends
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
