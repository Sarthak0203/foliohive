import { NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';

export async function POST(request) {
  const { email, password } = await request.json();
  const result = await loginUser(email, password);
  return result.success
    ? NextResponse.json(result.data)
    : NextResponse.json({ error: result.error }, { status: 401 });
}
