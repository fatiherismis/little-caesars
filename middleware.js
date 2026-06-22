import { NextResponse } from "next/server";

// Admin sayfalarını ve admin API'lerini korur.
// Giriş çerezi (admin_auth) geçerli değilse /admin/login'e yönlendirir.

const AUTH_COOKIE = "admin_auth";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const secret = process.env.ADMIN_SECRET || "dev-secret";
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const isAuthed = token && token === secret;

  // Giriş sayfası ve giriş/çıkış API'leri her zaman serbest
  const isPublicAuthRoute =
    pathname === "/admin/login" ||
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout";

  if (isPublicAuthRoute) {
    // Zaten giriş yapmışsa login sayfasından panele gönder
    if (pathname === "/admin/login" && isAuthed) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Korunan admin rotaları
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!isAuthed) {
      // API isteği ise 401 döndür, sayfa ise login'e yönlendir
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
