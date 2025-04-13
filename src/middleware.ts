import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // ✅ Not logged in trying to access protected routes
  if (
    !token &&
    (pathname.startsWith('/shopkeeper') || pathname.startsWith('/owner'))
  ) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // ✅ Logged in user visiting login page
  if (token && pathname === '/') {
    if (token.role === 'owner') {
      return NextResponse.redirect(new URL('/owner', req.url));
    } else if (token.role === 'shopkeeper') {
      return NextResponse.redirect(new URL('/shopkeeper', req.url));
    }
  }

  // ✅ Owner trying to access shopkeeper route — block it
  if (token && pathname.startsWith('/shopkeeper') && token.role !== 'shopkeeper') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // ✅ Shopkeeper trying to access owner route — block it
  if (token && pathname.startsWith('/owner') && token.role !== 'owner') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // ✅ Allow access by default
  return NextResponse.next();
}

// ✅ Match only routes we want to protect
export const config = {
  matcher: ['/', '/shopkeeper/:path*', '/owner/:path*'],
};
