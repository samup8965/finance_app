import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceAnonKey = process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
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

    // Fail mechansim rely on database

    if (!accessToken && !refreshToken) {
      console.log(" No tokens in cookies, checking database..");

      // Some checks

      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("Missing authentication token");
        return res.status(401).json({ error: "Missing authentication token" });
      }

      const token = authHeader.replace("Bearer ", "");
      const supabase = createClient(supabaseUrl, serviceAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser(token);

      if (authError) {
        console.error("Auth Error", authError);
        return res.status(401).json({ error: authError });
      }

      // Fetch the tokens from the database

      const { data: bankConnection, error: dbError } = await supabase
        .from("bank_connection")
        .select("access_token, refresh_token")
        .eq("user_id", user.id)
        .single();
      console.log("Database output", bankConnection);

      if (dbError) {
        console.error("Database error:", dbError);
        return res
          .status(404)
          .json({ error: "No bank connection found in database" });
      }

      if (
        bankConnection &&
        bankConnection.access_token &&
        bankConnection.refresh_token
      ) {
        accessToken = bankConnection.access_token;
        refreshToken = bankConnection.refresh_token;
        console.log("Retrieved tokens from database successfully");
      }
    }

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
