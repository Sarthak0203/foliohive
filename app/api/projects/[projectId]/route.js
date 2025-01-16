// app/api/projects/[projectId]/route.js

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Project from '@/models/Project';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request, { params }) {
  const { projectId } = params;

  try {
    // Ensure database connection
    await connectToDatabase();

    // Validate projectId format
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID format' },
        { status: 400 }
      );
    }

    // Find the project using the _id (default MongoDB ID)
    const project = await Project.findById(projectId);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Format the response to match the required structure
    const projectData = {
      projectId: project._id.toString(), // Set the projectId to be the Mongo _id as string
      name: project.name,
      description: project.description,
      owner: project.owner,
      githubLink: project.githubLink,
      demoLink: project.demoLink,
      tags: project.tags,
      likes: project.likes,
      comments: project.comments,
      views: project.views,
      weeklyViews: project.weeklyViews,
      monthlyViews: project.monthlyViews,
      quarterlyViews: project.quarterlyViews,
      halfYearlyViews: project.halfYearlyViews,
      shares: project.shares,
      bookmarks: project.bookmarks,
      reactions: project.reactions,
      status: project.status,
      isPublic: project.isPublic,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      slug: project.slug,
      __v: project.__v
    };

    return NextResponse.json(projectData);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}
