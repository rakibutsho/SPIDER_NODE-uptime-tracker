import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  // Get the user's session token
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    const callbackPath = request.nextUrl.pathname + request.nextUrl.search;
    loginUrl.searchParams.set("callbackUrl", callbackPath);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated, allow the request to proceed (proxy it through)
  return NextResponse.next();
}

export const config = {
  // Protect all routes under /dashboard
  matcher: ["/dashboard/:path*"],
};
