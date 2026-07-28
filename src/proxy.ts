/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  // In development, skip authentication and allow everything
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api).*)"],
};
