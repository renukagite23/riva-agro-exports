import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  const pathname = req.nextUrl.pathname;

  // 🚫 Block dashboard if not logged in
  if (pathname.startsWith("/admin/dashboard") && !token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // 🚫 Block login page if already logged in
  if (pathname === "/admin/login" && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
