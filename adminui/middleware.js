import { NextResponse } from "next/server";

export function middleware(request) {

  console.log("Middleware intercepted request to:", request.nextUrl.pathname);
  const { pathname } = request.nextUrl;

  const isAuthenticated = request.cookies.has("token");

  if (pathname.startsWith("/dashboard") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};