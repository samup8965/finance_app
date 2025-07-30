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
    const refreshAcessToken = async (refreshToken) => {
      console.log("Attempting to refresh access token..");

      const refreshResponse = await fetch(
        "https://auth.truelayer.com/connect/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            client_id: "personalfinancetracker-561293",
            client_secret: process.env.TRUELAYER_CLIENT_SECRET,
            refresh_token: refreshToken,
          }),
        }
      );

      const refreshData = await refreshResponse.json();
      console.log("Refresh response status", refreshResponse.status);

      if (!refreshResponse.ok) {
        console.error("Failed to refresh token", refreshData);
      }

      console.log("Successfully refreshed access token");
      return refreshData;
    };

    // Get tokens from cookies
    let accessToken = req.cookies.truelayer_access_token;
    const refreshToken = req.cookies.truelayer_refresh_token;

    console.log("Access token exists:", !!accessToken);
    console.log("Refresh token exists:", !!refreshToken);

    if (!accessToken && refreshToken) {
      try {
        const tokenData = await refreshAcessToken(refreshToken);
        accessToken = tokenData.access_token;

        if (!accessToken) {
          console.error("No access token returned from refresh");
        }

        // Now we can set new access token as cookie

        // Set the new access token as a cookie
        const maxAge = tokenData.expires_in
          ? tokenData.expires_in * 1000
          : 3600000; // Default 1 hour
        res.setHeader("Set-Cookie", [
          `truelayer_access_token=${accessToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=${Math.floor(
            maxAge / 1000
          )}; Path=/`,
        ]);

        console.log("New access token set in cookie");
      } catch (error) {
        console.error("Error refreshing token:", error);
        return res.status(401).json({
          error: "Failed to refresh access token.",
        });
      }
    }

    // Final check

    if (!accessToken) {
      console.log("No access token available after refresh attempt");
      return res.status(401).json({
        error: "No access token available. Please reconnect your bank account.",
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

    console.log(`Found ${accounts.length} accounts, fetching balances..`);

    // Fetch the balance Promises for each account

    const balancePromises = accounts.map(async (account) => {
      try {
        const balanceResponse = await fetch(
          `https://api.truelayer.com/data/v1/accounts/${account.account_id}/balance`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const balanceData = await balanceResponse.json();

        if (!balanceResponse.ok) {
          console.error(
            `Balance API error for account ${account.account_id}`,
            balanceData
          );
          return {
            account_id: account.account_id,
            account_number: account.account_number,
            display_name: account.display_name,
            error: balanceData.error || "Failed to fetch balance",
          };
        }

        return {
          account_id: account.account_id,
          account_number: account.account_number,
          display_name: account.display_name,
          balance: balanceData.results || balanceData,
        };
      } catch (error) {
        console.error(
          `Error fetching balance for account ${account.account_id}`,
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

    const balanceResults = await Promise.all(balancePromises);
    console.log("Successfully fetched balances");
    return res.status(200).json({
      accounts_with_balances: balanceResults,
    });
  } catch (error) {
    console.error("Error fetching balances", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/** Notes for myself
 * 
 * had to use async in map function because we do a HTTP request which returns a promise and we need await get a response without async cant use await
 * 
 * Each iteration of the map retuns a promise so we get an array of balancePromises
 * 
 Promise.all() takes an array of promises and waits for them all to complete and returns an array of their results concurrently

 Why not use a for loop? It would be sequential while Promise.all() is concurrent 
 * 
 * 
 * 
 * 
 */
