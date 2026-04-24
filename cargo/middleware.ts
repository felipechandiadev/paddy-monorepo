import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedRoutes = ['/weighing', '/receptions', '/despachos'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const isAuthenticated = !!token;

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === '/' && isAuthenticated) {
    const next =
      request.nextUrl.searchParams.get('redirect')?.trim() || '/weighing';
    const safe = next.startsWith('/') && !next.startsWith('//') ? next : '/weighing';
    return NextResponse.redirect(new URL(safe, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|static|.*\\..*).*)'],
};
