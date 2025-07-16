import { useDataContext } from "../context/DataContext";

export const RecurringPayments = () => {
  const { recurringPayments, standingOrders, directDebits } = useDataContext();
  const RecurringPaymentsWrapper = () => {};

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Recurring Payments</h2>

      {recurringPayments.length === 0 ? (
        <div>No recurring payments found.</div>
      ) : (
        recurringPayments.map((account) => (
          <div key={account.id} className="mb-6">
            <h3 className="text-lg font-medium mb-2">{account.payee_name}</h3>
            <p className="text-sm text-gray-600 mb-3">
              Total recurring payments: {account.total}
            </p>
          </div>
        ))
      )}
    </div>
  );
};
