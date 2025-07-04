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
    console.log(accessToken);

    if (!accessToken) {
      return res.status(401).json({
        error: "No access token found. Please reconnect your bank account.",
      });
    }

    const { account_id } = req.query;
    if (!account_id) {
      return res.status(400).json({ error: "Missing account_id" });
    }

    console.log("Making request to TrueLayer API");

    // Call TrueLayer API to get accounts
    const response = await fetch(
      `https://api.truelayer-sandbox.com/data/v1/accounts/${account_id}/balance`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    console.log("TrueLayer API response status", response.status);

    if (!response.ok) {
      console.error("TrueLayer API error", data);

      if (response.status === 401) {
        return res.status(401).json({
          error: "Token expired. Please reconnect your bank account",
        });
      }

      return res
        .status(response.status)
        .json({ error: data.error || "Failed to fetch balance" });
    }

    console.log("✅ Successfully fetched balance");
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching accounts", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
