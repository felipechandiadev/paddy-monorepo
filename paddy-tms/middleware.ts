import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const protectedRoutes = [
  '/paddy/dashboard',
  '/paddy/logistics/weighing',
];

const publicRoutes = [
  '/paddy/auth/login',
  '/paddy/logistics/monitor',
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
    const loginUrl = new URL('/paddy/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login
  if (pathname === '/paddy/auth/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/paddy/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/paddy/:path*'],
};
