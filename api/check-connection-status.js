import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceAnonKey = process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Missing auth token");
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
      console.log("Invalid or expired token", authError);
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const { data, error: dbError } = await supabase
      .from("bank_connection")
      .select("id")
      .eq("user_id", user.id);

    if (dbError) {
      console.error("Database error:", dbError.message);
    }

    console.log("Bank connection query result:", data);

    return res.json({ isConnected: data && data.length > 0 });
  } catch (error) {
    console.error("Function error", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
