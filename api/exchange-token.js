import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

export default async function handler(req, res) {
  try {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://finance-app-steel-seven.vercel.app",
    ];

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }

    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
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
    console.log("TrueLayer token data received");

    if (!tokenResponse.ok) {
      console.log("TrueLayer error:", tokenData);
      return res.status(tokenResponse.status).json(tokenData);
    }

    const authHeader = req.headers.authorization;
    console.log("Auth header present:", !!authHeader);

    if (!authHeader) {
      console.log("Missing authorization header");
      return res.status(401).json({ error: "Missing authorization header" });
    }

    if (!authHeader.startsWith("Bearer ")) {
      console.log("Invalid authorization header format");
      return res
        .status(401)
        .json({ error: "Invalid authorization header format" });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    console.log("Extracted token length:", token.length);
    console.log("Token starts with:", token.substring(0, 10) + "...");

    if (!token || token.length < 10) {
      console.log("Invalid or missing token");
      return res.status(401).json({ error: "Invalid or missing token" });
    }

    let user;
    try {
      console.log("Attempting to get user with token...");
      const { data, error } = await supabase.auth.getUser(token);

      console.log("Supabase auth response:", {
        hasData: !!data,
        hasUser: !!data?.user,
        hasError: !!error,
        error: error?.message,
      });

      if (error) {
        console.log("Supabase auth error:", error);
        return res.status(401).json({
          error: "Authentication failed",
          details: error.message,
        });
      }

      if (!data?.user) {
        console.log("No user found for token");
        return res.status(401).json({
          error: "Invalid token - no user found",
        });
      }

      user = data.user;
      console.log("Successfully authenticated user:", user.id);
    } catch (authError) {
      console.error("Authentication error:", authError);
      return res.status(401).json({
        error: "Authentication failed",
        details: authError.message,
      });
    }

    const userId = user.id;

    try {
      // No encryption implemented !!
      const encryptedAccessToken = tokenData.access_token;
      const encryptedRefreshToken = tokenData.refresh_token;

      console.log("Inserting bank connection for user:", userId);

      const { data, error } = await supabase.from("bank_connection").insert({
        user_id: userId,
        access_token: encryptedAccessToken,
        refresh_token: encryptedRefreshToken,
        expires_in: tokenData.expires_in,
      });

      if (error) {
        console.log("Supabase insert error:", error);
        return res.status(500).json({
          error: "Failed to save bank connection",
          details: error.message,
        });
      }

      console.log("Successfully saved bank connection");
    } catch (dbError) {
      console.error("Database error:", dbError);
      return res.status(500).json({
        error: "Database operation failed",
        details: dbError.message,
      });
    }

    const isProduction = process.env.NODE_ENV === "production";
    console.log("Environment - Production:", isProduction);

    const cookieSettings = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "Lax" : "Lax",
      path: "/",
    };

    const accessTokenMaxAge = tokenData.expires_in || 3600;
    const refreshTokenMaxAge = 7 * 24 * 3600;

    res.setHeader("Set-Cookie", [
      `truelayer_access_token=${tokenData.access_token}; HttpOnly; ${
        cookieSettings.secure ? "Secure;" : ""
      } SameSite=${
        cookieSettings.sameSite
      }; Max-Age=${accessTokenMaxAge}; Path=${cookieSettings.path}`,
      `truelayer_refresh_token=${tokenData.refresh_token || ""}; HttpOnly; ${
        cookieSettings.secure ? "Secure;" : ""
      } SameSite=${
        cookieSettings.sameSite
      }; Max-Age=${refreshTokenMaxAge}; Path=${cookieSettings.path}`,
    ]);

    console.log("✅ Tokens stored in HTTP-only cookies");

    return res.status(200).json({
      success: true,
      message: "Bank account connected successfully - tokens stored securely",
    });
  } catch (error) {
    console.error("Function error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
      // Don't expose stack trace in production
      ...(process.env.NODE_ENV !== "production" && { stack: error.stack }),
    });
  }
}
