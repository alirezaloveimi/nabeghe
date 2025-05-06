import { type NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";

enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

const protectedRoutes = ["/p-admin", "/p-user"];
const publicRoutes = ["/register-login"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (isProtectedRoute) {
    if (!session?.userPhone) {
      return NextResponse.redirect(new URL("/register-login", req.nextUrl));
    }

    const targetPath = session.role === Role.ADMIN ? "/p-admin" : "/p-user";
    if (!path.startsWith(targetPath)) {
      return NextResponse.redirect(new URL(targetPath, req.nextUrl));
    }
  }

  if (isPublicRoute && session?.userPhone) {
    const targetPath = session.role === Role.ADMIN ? "/p-admin" : "/p-user";
    return NextResponse.redirect(new URL(targetPath, req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
