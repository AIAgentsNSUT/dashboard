import { authkit } from "@workos-inc/authkit-nextjs";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/:path*"],
};

export default async function middleware(request: NextRequest) {
  // Skip auth for WorkOS routes
  if (request.nextUrl.pathname.startsWith("/api/workos")) {
    return NextResponse.next();
  }

  const { session, headers } = await authkit(request, {
    debug: process.env.NODE_ENV === "development",
  });
  if (!session.user) {
    const hostname = request.headers.get("host") || "";
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const absoluteUrl = `${protocol}://${hostname}/api/workos/redirect`;
    return NextResponse.redirect(absoluteUrl);
  }

  return NextResponse.next({
    headers: headers,
  });
}
