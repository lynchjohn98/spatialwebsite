import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// ✅ Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  try {
    console.log("🔹 In POST Handler - Message Upload");

    // ✅ Read & Parse Request Body
    const body = await req.json();
    console.log("📦 Received Body:", body);

    // ✅ Validate Message
    if (!body.message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    // ✅ Return a Proper Response
    return NextResponse.json({ success: true, message: "Message received!" }, { status: 200 });

  } catch (error) {
    console.error("❌ Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
