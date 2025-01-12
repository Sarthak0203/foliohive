// app/api/auth/oauth/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getProviderAuthUrl, handleOAuthCallback } from '@/lib/oauthUtils';
import { generateTokenPair } from '@/lib/auth';

export async function GET(request) {
  try {
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
        // Ensure the user data has the required _id property
        const user = {
          _id: result.data.providerId, // or generate a new _id if needed
          ...result.data,
        };

        const { accessToken, refreshToken } = generateTokenPair(user);

        // Await cookies() before setting cookies
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

        // Use absolute URL for redirect
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