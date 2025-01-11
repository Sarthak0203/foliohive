import { NextResponse } from 'next/server';
import { getProjectAnalytics } from '@/lib/analytics';

export async function GET(request) {
  const url = new URL(request.url);
  const projectId = url.searchParams.get('projectId');
  const analytics = await getProjectAnalytics(projectId);

  return analytics
    ? NextResponse.json(analytics)
    : NextResponse.json({ error: "Analytics not found" }, { status: 404 });
}
