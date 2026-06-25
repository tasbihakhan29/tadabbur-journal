import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminCredentials,
  createAdminToken,
  COOKIE_NAME,
  TOKEN_MAX_AGE,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body as { username?: string; password?: string };

    if (!username || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const valid = await verifyAdminCredentials(username, password);
    if (!valid) {
      // Constant-time-ish delay to slow brute force
      await new Promise((r) => setTimeout(r, 600));
      console.log("ENV USER:", process.env.ADMIN_USERNAME);
console.log("INPUT USER:", username);

      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = createAdminToken();

    const res = NextResponse.json({ success: true });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: TOKEN_MAX_AGE,
      path: "/",
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(COOKIE_NAME);
  return res;
}
