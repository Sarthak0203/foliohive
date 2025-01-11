import { NextResponse } from 'next/server';
import { handleInteraction } from '@/lib/interactions';

export async function POST(request) {
  const interactionData = await request.json();
  const result = await handleInteraction(interactionData);

  return result.success
    ? NextResponse.json(result.data)
    : NextResponse.json({ error: result.error }, { status: 400 });
}
