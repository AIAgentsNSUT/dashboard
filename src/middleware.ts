import { authkit } from "@workos-inc/authkit-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { getOrganisationSignInUrl } from "./lib/auth";

const routes = ["/:path*"];

export default async function middleware(request: NextRequest) {
  // Skip auth for WorkOS callback routes
  if (request.nextUrl.pathname.startsWith("/api/auth/workos")) {
    return NextResponse.next();
  }

  const { session, headers } = await authkit(request, {
    debug: process.env.NODE_ENV === "development",
  });
  if (!session.user) {
    // Get hostname from request
    const hostname = request.headers.get("host") || "";

    try {
      const signInURL = await getOrganisationSignInUrl(hostname);
      if (!signInURL) {
        return new NextResponse("Organization not found", { status: 404 });
      }
      return NextResponse.redirect(signInURL);
    } catch (error) {
      console.error("Error getting sign in URL:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }

  return NextResponse.next({
    headers: headers,
  });
}

export const config = { matcher: routes };
