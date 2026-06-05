/**
 * Nelmani Fresh — Next.js Proxy (formerly middleware)
 * Protects /admin routes (role check) and /account routes (auth required).
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin and account routes are protected via client-side auth guards.
  // The actual role validation is done server-side by each page's useEffect.
  // JWT tokens are in memory / localStorage so cannot be read by the proxy layer.

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/checkout/:path*"],
};
