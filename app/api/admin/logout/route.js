import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/auth";

// POST /api/admin/logout — çerezi siler.
export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
