// Add this at the very top of your handler function
export default async function handler(req, res) {
  // THIS SHOULD ALWAYS LOG - if it doesn't, the endpoint isn't being hit
  console.log("=== API HANDLER STARTED ===");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("Headers:", JSON.stringify(req.headers, null, 2));
  console.log("Cookies:", req.cookies);

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
    console.log("Handling OPTIONS request");
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    console.log("Method not allowed:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get the cookie from HTTP cookie
    const accessToken = req.cookies.truelayer_access_token;
    console.log("Access token exists:", !!accessToken);
    console.log(
      "Access token (first 10 chars):",
      accessToken?.substring(0, 10) + "..."
    );

    if (!accessToken) {
      console.log("No access token found in cookies");
      return res.status(401).json({
        error: "No access token found. Please reconnect your bank account.",
      });
    }

    // Need to get all accounts from accounts endpoint
    console.log("Making request to TrueLayer accounts API...");

    const accountsResponse = await fetch(
      "https://api.truelayer.com/data/v1/accounts",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const accountsData = await accountsResponse.json();
    console.log("Accounts API response status:", accountsResponse.status);
    console.log(
      "Accounts API response:",
      JSON.stringify(accountsData, null, 2)
    );

    if (!accountsResponse.ok) {
      console.error("TrueLayer Accounts API error:", accountsData);

      if (accountsResponse.status === 401) {
        console.log("TOKEN EXPIRED - returning 401");
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
    console.log("Number of accounts found:", accounts.length);

    if (accounts.length === 0) {
      console.log("No accounts found");
      return res.status(404).json({ error: "No accounts found" });
    }

    console.log(`Found ${accounts.length} accounts, fetching transactions.`);

    // Fetch the transaction Promises for each account
    const transactionPromises = accounts.map(async (account) => {
      console.log(`Fetching transactions for account: ${account.account_id}`);
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
        console.log(
          `Transaction response for ${account.account_id}:`,
          transactionResponse.status
        );

        if (!transactionResponse.ok) {
          console.error(
            `Transaction API error for account ${account.account_id}:`,
            transactionData
          );
          return {
            account_id: account.account_id,
            account_number: account.account_number,
            display_name: account.display_name,
            error: transactionData.error || "Failed to fetch transactions",
          };
        }

        console.log(
          `Successfully fetched ${
            transactionData.results?.length || 0
          } transactions for ${account.account_id}`
        );

        return {
          account_id: account.account_id,
          account_number: account.account_number,
          display_name: account.display_name,
          transactions: transactionData.results || transactionData,
        };
      } catch (error) {
        console.error(
          `Error fetching transactions for account ${account.account_id}:`,
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
    console.log("Waiting for all transaction promises...");
    const transactionResults = await Promise.all(transactionPromises);
    console.log("Successfully fetched all transactions");

    return res.status(200).json({
      accounts_with_transactions: transactionResults,
    });
  } catch (error) {
    console.error("Outer catch error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
