// No import needed - fetch is available globally in Vercel

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Missing code" });
  }

  try {
    // Send POST request to Truelayer's token endpoint
    const tokenResponse = await fetch(
      "https://auth.truelayer.com/connect/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: process.env.TRUECLIENT_ID,
          client_secret: process.env.TRUECLIENT_SECRET,
          redirect_uri: process.env.TRUE_REDIRECT_URI,
          code: code,
        }),
      }
    );

    const data = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return res.status(tokenResponse.status).json(data);
    }

    // Return successful response
    return res.status(200).json(data);
  } catch (error) {
    console.error("Token exchange error:", error);
    return res.status(500).json({ error: error.message });
  }
};
