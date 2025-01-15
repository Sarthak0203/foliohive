// app/api/auth/oauth/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getProviderAuthUrl, handleOAuthCallback } from '@/lib/oauthUtils';
import { generateTokenPair } from '@/lib/auth';
import User from '@/models/User';
import { connectToDatabase } from '@/lib/mongodb';

const demoProfilePictures = [
  '/images/avatar1.jpg',
  '/images/avatar2.jpg',
  '/images/avatar3.png',
  // Add more demo pictures as needed
];

export async function GET(request) {
  try {
    await connectToDatabase(); // Connect to the database

    const url = new URL(request.url);
    const provider = url.searchParams.get('provider');
    const code = url.searchParams.get('code');

    if (!code && provider) {
      const authUrl = getProviderAuthUrl(provider);
      return NextResponse.redirect(authUrl, 307);
    }

    if (code && provider) {
      const result = await handleOAuthCallback(provider, code);

      if (result.success) {
        let user = await User.findOne({ email: result.data.email });

        if (!user) {
          // Create a new user if not found
          user = new User({
            name: result.data.name,
            email: result.data.email,
            // Use the provider's profile picture if available, otherwise choose a random demo picture
            profilePicture: result.data.picture || demoProfilePictures[Math.floor(Math.random() * demoProfilePictures.length)],
          });
          await user.save();
        }

        const { accessToken, refreshToken } = generateTokenPair(user);

        const cookieStore = await cookies();
        await cookieStore.set('accessToken', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 15 * 60,
        });
        await cookieStore.set('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60,
        });

        return NextResponse.redirect(new URL('/dashboard', request.url), 307);
      }

      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('OAuth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}