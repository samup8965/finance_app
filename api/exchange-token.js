export default async function handler(req, res) {
  // Add debugging
  console.log("Function called with method:", req.method);
  console.log("Request body:", req.body);
  console.log("Environment variables check:", {
    hasClientId: !!process.env.TRUELAYER_CLIENT_ID,
    hasClientSecret: !!process.env.TRUELAYER_CLIENT_SECRET,
    hasRedirectUri: !!process.env.TRUELAYER_REDIRECT_URI,
  });

  console.log(process.env.TRUELAYER_CLIENT_ID);
  console.log(process.env.TRUELAYER_CLIENT_SECRET);
  console.log(process.env.TRUELAYER_REDIRECT_URI);

  try {
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
      console.log("Handling OPTIONS request");
      res.status(200).end();
      return;
    }

    if (req.method !== "POST") {
      console.log("Invalid method:", req.method);
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { code } = req.body;

    if (!code) {
      console.log("Missing code in request body");
      return res.status(400).json({ error: "Missing code" });
    }

    console.log("Making request to TrueLayer...");

    // Send POST request to Truelayer's token endpoint
    const tokenResponse = await fetch(
      "https://auth.truelayer-sandbox.com/connect/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: process.env.TRUELAYER_CLIENT_ID,
          client_secret: process.env.TRUELAYER_CLIENT_SECRET,
          redirect_uri: process.env.TRUELAYER_REDIRECT_URI,
          code: code,
        }),
      }
    );

    console.log("TrueLayer response status:", tokenResponse.status);

    const data = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.log("TrueLayer error:", data);
      return res.status(tokenResponse.status).json(data);
    }

    console.log("Success! Returning token data");
    return res.status(200).json(data);
  } catch (error) {
    console.error("Function error:", error);
    return res.status(500).json({
      error: error.message,
      stack: error.stack, // This will help debug
    });
  }
}
