import { NextRequest, NextResponse } from 'next/server';

const authRoutes = ['/os-login'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie =
    request.cookies.get('better-auth.session_token') ||
    request.cookies.get('__Secure-better-auth.session_token');

  const isProtected =
    pathname.startsWith('/os-dashboard') ||
    pathname.startsWith('/admin-portal') ||
    pathname.startsWith('/logistics-portal');
  const isAuthRoute = authRoutes.some(r => pathname.startsWith(r));

  // Role enforcement is handled client-side in each portal page.
  // Nem bejelentkezett → login-ra
  if (isProtected && !sessionCookie) {
    const url = new URL('/os-login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Session cookie cannot be role-decoded in proxy without auth API calls.
  // Keep /os-login redirect simple; portal pages enforce role client-side.
  // If user is already on admin/logistics portal and authenticated, allow through.
  if (sessionCookie && (pathname.startsWith('/admin-portal') || pathname.startsWith('/logistics-portal'))) {
    return NextResponse.next();
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
