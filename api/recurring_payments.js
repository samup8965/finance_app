// API handler for fetching recurring payments (standing orders + direct debits)

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceAnonKey = process.env.SUPABASE_ANON_KEY;

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

    if (!accessToken && !refreshToken) {
      console.log(" No tokens in cookies, checking database..");

      // Some checks

      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
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
            type: "STANDING_ORDER",
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
            type: "DIRECT_DEBIT",
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
