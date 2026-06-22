import { NextResponse } from "next/server";
import { checkCredentials, AUTH_COOKIE } from "@/lib/auth";

// POST /api/admin/login — kullanıcı adı/şifre doğrular, çerez ayarlar.
export async function POST(request) {
  const { username, password } = await request.json();

  if (!checkCredentials(username, password)) {
    return NextResponse.json(
      { error: "Kullanıcı adı veya şifre hatalı." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE, process.env.ADMIN_SECRET || "dev-secret", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 saat
  });
  return response;
}
