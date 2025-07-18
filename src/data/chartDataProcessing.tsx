import { type Transaction } from "../context/DataContext";

export const getMonthlyIncome = (transactions: Transaction[]) => {
  const monthlyData = transactions
    .filter((transaction) => transaction.amount > 0) // Only income (positive amounts)
    .reduce((acc, transaction) => {
      const month = new Date(transaction.date).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += transaction.amount;

      return acc;
    }, {} as Record<string, number>);

  return Object.entries(monthlyData)
    .map(([month, income]) => ({
      month,
      income: parseFloat(income.toFixed(2)),
    }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
};

export const getMonthlyExpenses = (transactions: Transaction[]) => {
  const monthlyData = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((accumalator, transaction) => {
      // We start with an empty object {}

      // We convert the date into a month/year format
      const month_year = new Date(transaction.date).toLocaleDateString(
        "en-US",
        {
          month: "short",
          year: "numeric",
        }
      );
      // So this returns it as Jan 2024 for example this would be the key

      // If the month does not exist we update the value held at that month with 0 otherwise we add the amount
      if (!accumalator[month_year]) {
        accumalator[month_year] = 0;
      }
      accumalator[month_year] += Math.abs(transaction.amount); // For display positive needed
      return accumalator;
      // By the end we get one Object
      // { "Jan 2024": 80, "Feb 2024": 100 } and so on
    }, {} as Record<string, number>);

  return Object.entries(monthlyData)
    .map(([month, spending]) => ({
      month,
      spending: parseFloat(spending.toFixed(2)),
    }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  // Here I convert our flat object using .entries into an array of key-value pairs

  // Loop through each key value pair use array deconstructing to create a new object for each new pair
};

// This function works the same way but they key is categories instead of dates

export const getCategoryBreakdown = (transactions: Transaction[]) => {
  const categoryData = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((accumalator, transaction) => {
      const category = transaction.transaction_category;

      if (!accumalator[category]) {
        accumalator[category] = 0;
      }
      accumalator[category] += Math.abs(transaction.amount);

      return accumalator;
    }, {} as Record<string, number>);

  return Object.entries(categoryData).map(([category, value]) => ({
    category,
    value: parseFloat(value.toFixed(2)),
  }));
};

export const getMonthlyBalance = (transactions: Transaction[]) => {
  const monthlyData = transactions.reduce((acc, transaction) => {
    const month = new Date(transaction.date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

    if (!acc[month]) {
      acc[month] = { income: 0, expenses: 0 };
    }

    if (transaction.amount > 0) {
      acc[month].income += transaction.amount;
    } else {
      acc[month].expenses += Math.abs(transaction.amount);
    }

    return acc;
  }, {} as Record<string, { income: number; expenses: number }>);

  return Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      balance: parseFloat((data.income - data.expenses).toFixed(2)),
    }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
};
