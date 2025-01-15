// app/api/auth/check/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; 
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // Await cookies() before using it
    const cookieStore = await cookies(); 
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const decoded = jwt.verify(accessToken, SECRET_KEY);
    return NextResponse.json({ authenticated: true, user: decoded });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}