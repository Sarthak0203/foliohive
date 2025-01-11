import { NextResponse } from 'next/server';
import { handleOAuthCallback } from '@/lib/auth';

export async function GET(request) {
  const url = new URL(request.url);
  const provider = url.searchParams.get('provider');
  const result = await handleOAuthCallback(provider, request);

  return result.success
    ? NextResponse.json(result.data)
    : NextResponse.json({ error: result.error }, { status: 400 });
}
