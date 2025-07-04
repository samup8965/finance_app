export default async function handler(req, res) {
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
    console.log("Received code in backend:", code);

    if (!code) {
      console.log("Missing code in request body");
      return res.status(400).json({ error: "Missing code" });
    }

    console.log("Making request to TrueLayer...");

    const requestBody = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.TRUELAYER_CLIENT_ID,
      client_secret: process.env.TRUELAYER_CLIENT_SECRET,
      redirect_uri: process.env.TRUELAYER_REDIRECT_URI,
      code: code,
    });

    console.log("Token exchange request body:", requestBody.toString());

    const tokenResponse = await fetch(
      "https://auth.truelayer-sandbox.com/connect/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: requestBody,
      }
    );

    console.log("TrueLayer response status:", tokenResponse.status);

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.log("TrueLayer error:", tokenData);
      return res.status(tokenResponse.status).json(tokenData);
    }

    // We set cookies by using a Set-cookie header on a request so the browser can do it

    // We store the access token give it the HTTP flag

    // Block cross site requests

    const isProduction = process.env.TRUELAYER_ENVIRONMENT === "production";
    const isSecure = isProduction; // Only secure in production
    const sameSite = isProduction ? "None" : "Lax"; // None for cross-origin in production, Lax for development

    res.setHeader("Set-Cookie", [
      `truelayer_access_token=${tokenData.access_token}; HttpOnly; ${
        isSecure ? "Secure;" : ""
      } SameSite=${sameSite}; Max-Age=${tokenData.expires_in || 3600}; Path=/`,
      `truelayer_refresh_token=${tokenData.refresh_token || ""}; HttpOnly; ${
        isSecure ? "Secure;" : ""
      } SameSite=${sameSite}; Max-Age=${7 * 24 * 3600}; Path=/`,
    ]);

    console.log("✅ Tokens stored in HTTP-only cookies");

    return res.status(200).json({
      success: true,
      message: "Bank account connected successfully - tokens stored securely",
    });
  } catch (error) {
    console.error("Function error:", error);
    return res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
}
