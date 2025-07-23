import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

export default async function handler(req, res) {
  try {
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");

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
      "https://auth.truelayer.com/connect/token",
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
    console.log(tokenData);

    if (!tokenResponse.ok) {
      console.log("TrueLayer error:", tokenData);
      return res.status(tokenResponse.status).json(tokenData);
    }

    // Saving to Database no encryption !!

    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log(session);
    const userId = session.user.id;

    const encryptedAccessToken = tokenData.access_token;
    const encryptedRefreshToken = tokenData.refresh_token;

    const { data, error } = await supabase.from("bank_connection").insert({
      user_id: userId,
      access_token: encryptedAccessToken,
      refresh_token: encryptedRefreshToken,
      expires_in: tokenData.expires_in,
    });
    if (error) {
      console.log("Supabase insert error", { data, error });
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
