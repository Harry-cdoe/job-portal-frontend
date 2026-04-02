import { NextResponse } from "next/server";

export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/candidate/:path*", "/company/:path*", "/admin/:path*"]
};
