// red - HTTP request

export default async function handler(req, res) {
  console.log("fetching accounts");

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

    // Need to get all accounts from accounts endpoint

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

    // Now we extract those accounts

    const accounts = accountsData.results || [];

    if (accounts.length === 0) {
      return res.status(404);
    }

    console.log(`Found ${accounts.length} accounts, fetching transactions.`);

    // Fetch the transaction Promises for each account

    const transactionPromises = accounts.map(async (account) => {
      try {
        const transactionResponse = await fetch(
          `https://api.truelayer.com/data/v1/accounts/${account.account_id}/transactions`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const transactionData = await transactionResponse.json();

        if (!transactionResponse.ok) {
          console.error(
            `Balance API error for account ${account.account_id}`,
            transactionData
          );
          return {
            account_id: account.account_id,
            account_number: account.account_number,
            display_name: account.display_name,
            error: transactionData.error || "Failed to fetch transactions",
          };
        }

        return {
          account_id: account.account_id,
          account_number: account.account_number,
          display_name: account.display_name,
          transactions: transactionData.results || transactionData,
        };
      } catch (error) {
        console.error(
          `Error fetching transactions for account ${account.account_id}`,
          error
        );
        return {
          account_id: account.account_id,
          account_number: account.account_number,
          display_name: account.display_name,
          error: "Internal server error",
        };
      }
    });

    // Wait for all those promises and their results

    const transactionResults = await Promise.all(transactionPromises);
    console.log("Successfully fetched balances");
    return res.status(200).json({
      accounts_with_transactions: transactionResults,
    });
  } catch (error) {
    console.error("Error fetching balances", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
