import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth?.token;

    // If no token exists and the user tries to access a protected route
    if (!token && pathname.startsWith("/admin")) {
      const loginUrl = new URL("/auth/signin", req.url);
      loginUrl.searchParams.set("callbackUrl", req.url); // Redirect back after login
      return NextResponse.redirect(loginUrl);
    }

    // Example: Role-based access control
    if (pathname.startsWith("/admin") && token?.role !== "admin") {
   
      const unauthorizedUrl = new URL("/403", req.url);
      return NextResponse.redirect(unauthorizedUrl);
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/auth/signin", // Custom sign-in page
    },
  }
);

// Specify the routes that require authentication
export const config = {
  matcher: [
    "/admin/:path*", // Protect all routes under /admin
    "/admin/:path*", // Protect /dashboard as an example
  ],
};
