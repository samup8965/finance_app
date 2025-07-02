import fetch from "node-fetch"; // To make HTTP requests

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // OPTIONS is part of CORS and must return 200 without failing before calling vercel

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code } = req.body;

  if (!code) {
    // Need code to proceed
    return res.status(400).json({ error: "Missing code" });
  }

  try {
    // Send POST request to Truelayer's token endpoint

    // tokenResponse is a response object
    const tokenResponse = await fetch(
      "https://auth.truelayer.com/connect/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // The format server expects to receive the data
        },
        // Search those params in URL
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
      // SOmething went wrong with the TrueLayer API requests
      return res.status(tokenResponse.status).json(data);
    }

    // Sucessful: we can return the token data to the frontend
    return res.status(200).json(data);
  } catch (error) {
    // Unexpected netwrok erros
    return res.status(500).json({ error: error.message });
  }
}
