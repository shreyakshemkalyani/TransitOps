import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Optional: Implement RBAC. If token.role doesn't match required role, redirect.
    if (path.startsWith("/maintenance") && token?.role !== "Fleet Manager") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    
    if (path.startsWith("/analytics") && !["Fleet Manager", "Financial Analyst"].includes(token?.role)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    
    if (path.startsWith("/expenses") && token?.role !== "Financial Analyst") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (path.startsWith("/drivers") && !["Fleet Manager", "Safety Officer"].includes(token?.role)) {
       return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // If authenticated, just continue
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/analytics/:path*",
    "/vehicles/:path*",
    "/drivers/:path*",
    "/trips/:path*",
    "/maintenance/:path*",
    "/expenses/:path*"
  ],
};
