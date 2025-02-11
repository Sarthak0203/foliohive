// app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import User from '@/models/User';
import { comparePassword, generateTokenPair, hashPassword } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcrypt';

export async function POST(request) {
  try {
    await connectToDatabase();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const { accessToken, refreshToken } = generateTokenPair(user);

    const cookieStore = await cookies(); // Await cookies()
    await cookieStore.set('accessToken', accessToken, { // Await cookieStore.set()
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1500 * 60,
    });
    await cookieStore.set('refreshToken', refreshToken, { // Await cookieStore.set()
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    return NextResponse.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}