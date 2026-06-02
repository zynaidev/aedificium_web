import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/os-dashboard'];
const authRoutes = ['/os-login'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie =
    request.cookies.get('better-auth.session_token') ||
    request.cookies.get('__Secure-better-auth.session_token');

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !sessionCookie) {
    return NextResponse.redirect(new URL('/os-login', request.url));
  }

  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL('/os-dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/os-dashboard/:path*', '/os-login'],
};