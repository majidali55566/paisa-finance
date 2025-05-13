import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

const PUBLIC_ROUTES = ["/login", "/signup", "verify"];
const AUTH_ROUTES = ["/dashboard"];
const DEFAULT_REDIRECT = "/dashboard";
const LOGIN_REDIRECT = "/login";
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup", "/", "/verify/:path*"],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  //protect authenticated routes
  if (
    AUTH_ROUTES.some((route) => pathname.startsWith(route)) &&
    (!token || token.error)
  ) {
    return NextResponse.redirect(new URL(LOGIN_REDIRECT, request.url));
  }
  //redirect loggedin users from auth pages
  if (
    token &&
    !token.error &&
    PUBLIC_ROUTES.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL(DEFAULT_REDIRECT, request.url));
  }

  return NextResponse.next();
}
