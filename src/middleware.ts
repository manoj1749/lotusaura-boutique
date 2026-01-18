import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // Only protect /admin routes
  if (url.pathname.startsWith("/admin")) {
    const authHeader = req.headers.get("authorization");

    if (authHeader) {
      const authValue = authHeader.split(" ")[1];
      const [user, pwd] = atob(authValue).split(":");

      const validUser = process.env.ADMIN_USER || "admin";
      const validPwd = process.env.ADMIN_PASSWORD || "admin123";

      if (user === validUser && pwd === validPwd) {
        return NextResponse.next();
      }
    }

    // Request Basic Auth
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Admin Area"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
