import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  // Get the user's session token
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  // If there's no valid token, redirect to the login page
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated, allow the request to proceed (proxy it through)
  return NextResponse.next();
}

export const config = {
  // Protect all routes under /dashboard
  matcher: ["/dashboard/:path*"],
};
