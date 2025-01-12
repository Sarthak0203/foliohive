// middleware.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export function middleware(request) {
  const url = request.nextUrl.pathname;
  const protectedRoutes = ['/api/projects', '/api/interactions', '/dashboard', '/profile'];

  if (protectedRoutes.some((route) => url.startsWith(route))) {
    try {
      const accessToken = request.cookies.get('accessToken')?.value;
      if (!accessToken) {
        return new NextResponse(null, {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Basic realm="Protected Area"',
          },
        });
      }

      const decoded = jwt.verify(accessToken, SECRET_KEY);
      request.user = decoded;
    } catch (err) {
      return new NextResponse(null, {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Protected Area"',
        },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/projects/:path*', '/api/interactions/:path*', '/dashboard/:path*', '/profile/:path*'],
};