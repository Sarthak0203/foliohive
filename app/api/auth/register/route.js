import { NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth';

export async function POST(request) {
  const userData = await request.json();
  const result = await registerUser(userData);
  return result.success
    ? NextResponse.json(result.data)
    : NextResponse.json({ error: result.error }, { status: 400 });
}
