import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET; // Use a strong secret key

export async function middleware(request) {
  const url = request.nextUrl;
  const protectedRoutes = ['/api/projects', '/api/interactions', '/dashboard', '/profile'];

  if (protectedRoutes.some((route) => url.pathname.startsWith(route))) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      request.user = decoded; // Attach user data to the request
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

// Rate limiting can be added here if required for specific routes.
export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*', '/profile/:path*'],
};
