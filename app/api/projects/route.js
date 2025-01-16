// app/api/projects/route.js

import { NextResponse } from 'next/server';
import { getAllProjects, createProject } from '@/lib/projects';
import { connectToDatabase } from '@/lib/mongodb';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth';
import Project from '@/models/Project';

export async function GET() {
  try {
    const projects = await getAllProjects(); // Get all projects from the database
    return NextResponse.json(projects); // Return the list of projects
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = await verifyAccessToken(accessToken.value);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, githubLink, demoLink, technologies, tags, status } = await request.json();

    const project = new Project({
      name,
      description,
      githubLink,
      demoLink,
      technologies: technologies.split(',').map(tech => tech.trim()),
      tags: tags.split(',').map(tag => tag.trim()),
      status: status || 'draft',
      owner: userId.id,
    });

    await project.save();

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Project creation error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}