// API handler for fetching recurring payments (standing orders + direct debits)

export default async function handler(req, res) {
  console.log("fetching recurring payments");

  const allowedOrigins = [
    "http://localhost:5173",
    "https://finance-app-steel-seven.vercel.app",
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method == "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get the cookie from HTTP cookie
    const accessToken = req.cookies.truelayer_access_token;

    if (!accessToken) {
      return res.status(401).json({
        error: "No access token found. Please reconnect your bank account.",
      });
    }

    // Get all accounts from accounts endpoint
    const accountsResponse = await fetch(
      "https://api.truelayer.com/data/v1/accounts",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const accountsData = await accountsResponse.json();
    console.log("Accounts API response status", accountsResponse.status);

    if (!accountsResponse.ok) {
      console.error("TrueLayer Accounts API error", accountsData);

      if (accountsResponse.status === 401) {
        return res.status(401).json({
          error: "Token expired. Please reconnect your bank account",
        });
      }
      return res
        .status(accountsResponse.status)
        .json({ error: accountsData.error });
    }

    const accounts = accountsData.results || [];

    if (accounts.length === 0) {
      return res.status(404).json({ error: "No accounts found" });
    }

    console.log(
      `Found ${accounts.length} accounts, fetching recurring payments.`
    );

    // Fetch both standing orders and direct debits for each account
    const recurringPaymentsPromises = accounts.map(async (account) => {
      try {
        // Fetch standing orders and direct debits in parallel
        const [standingOrdersResponse, directDebitsResponse] =
          await Promise.all([
            fetch(
              `https://api.truelayer.com/data/v1/accounts/${account.account_id}/standing_orders`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            ),
            fetch(
              `https://api.truelayer.com/data/v1/accounts/${account.account_id}/direct_debits`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            ),
          ]);

        const [standingOrdersData, directDebitsData] = await Promise.all([
          standingOrdersResponse.json(),
          directDebitsResponse.json(),
        ]);

        let standingOrders = [];
        let directDebits = [];

        // Handle standing orders response
        if (standingOrdersResponse.ok) {
          console.log("These are the results", standingOrdersData);
          standingOrders = (standingOrdersData.results || []).map((order) => ({
            ...order,
            type: "standing_order",
          }));
        } else {
          console.error(
            `Standing orders API error for account ${account.account_id}`,
            standingOrdersData
          );
        }

        // Handle direct debits response
        if (directDebitsResponse.ok) {
          console.log("These are the results", directDebitsData);
          directDebits = (directDebitsData.results || []).map((debit) => ({
            ...debit,
            type: "direct_debit",
          }));
        } else {
          console.error(
            `Direct debits API error for account ${account.account_id}`,
            directDebitsData
          );
        }

        return {
          account_id: account.account_id,
          account_number: account.account_number,
          display_name: account.display_name,
          standing_orders: standingOrders,
          direct_debits: directDebits,
          total_recurring_payments: standingOrders.length + directDebits.length,
        };
      } catch (error) {
        console.error(
          `Error fetching recurring payments for account ${account.account_id}`,
          error
        );
        return {
          account_id: account.account_id,
          account_number: account.account_number,
          display_name: account.display_name,
          error: "Internal server error",
          standing_orders: [],
          direct_debits: [],
          total_recurring_payments: 0,
        };
      }
    });

    // Wait for all promises to resolve
    const recurringPaymentsResults = await Promise.all(
      recurringPaymentsPromises
    );

    console.log("Successfully fetched recurring payments");
    return res.status(200).json({
      accounts_with_recurring_payments: recurringPaymentsResults,
    });
  } catch (error) {
    console.error("Error fetching recurring payments", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
