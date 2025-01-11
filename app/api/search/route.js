import { NextResponse } from 'next/server';
import { searchProjects } from '@/lib/projects';

export async function GET(request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('query');
  const tags = url.searchParams.get('tags')?.split(',') || [];
  const results = await searchProjects(query, tags);

  return NextResponse.json(results);
}
