import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes: Record<string, string[]> = {
  '/os-dashboard':    ['designer', 'admin', 'architect'],
  '/admin-portal':    ['admin'],
  '/logistics-portal':['logistics', 'admin'],
};

const authRoutes = ['/os-login'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie =
    request.cookies.get('better-auth.session_token') ||
    request.cookies.get('__Secure-better-auth.session_token');

  const isProtected = Object.keys(protectedRoutes).some(r => pathname.startsWith(r));
  const isAuthRoute = authRoutes.some(r => pathname.startsWith(r));

  // Nem bejelentkezett → login-ra
  if (isProtected && !sessionCookie) {
    const url = new URL('/os-login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Már bejelentkezett → ne menjen a login oldalra
  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL('/os-dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/os-dashboard/:path*',
    '/admin-portal/:path*',
    '/logistics-portal/:path*',
    '/os-login',
  ],
};
