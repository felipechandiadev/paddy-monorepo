import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const protectedRoutes = [
  '/weighing',
];

const publicRoutes = [
  '/login',
  '/monitor',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('auth_token')?.value;
  const isAuthenticated = !!token;

  // Check if route is protected
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublic = publicRoutes.some(route => pathname.startsWith(route));

  // Redirect unauthenticated users from protected routes to login
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login
  if (pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/weighing', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|static|.*\\..*).*)'],
};
