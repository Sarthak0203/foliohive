import { NextResponse } from 'next/server';

export async function POST(request) {
  return NextResponse.json({ message: "Authentication endpoint not implemented" }, { status: 501 });
}
