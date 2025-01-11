// app/api/projects/route.js

import { NextResponse } from 'next/server';
import { getAllProjects, createProject } from '@/lib/projects';

export async function GET() {
  try {
    const projects = await getAllProjects(); // Get all projects from the database
    return NextResponse.json(projects); // Return the list of projects
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request) {
  const projectData = await request.json(); // Parse the incoming project data

  try {
    const result = await createProject(projectData); // Create a new project
    return result.success
      ? NextResponse.json(result.data) // Return the created project
      : NextResponse.json({ error: result.error }, { status: 400 }); // Return error if creation fails
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
