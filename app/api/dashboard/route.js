// app/api/dashboard/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Project from '@/models/Project';
import User from '@/models/User';

export async function GET(request) {
  try {
    await connectToDatabase();
    
    // Get user ID from the session (you'll need to implement authentication)
    // For now, we'll get the first user as a placeholder
    const user = await User.findOne({ role: 'user' });
    
    // Fetch user's projects with aggregated metrics
    const projects = await Project.aggregate([
      { $match: { owner: user._id } },
      {
        $addFields: {
          totalEngagement: {
            $sum: [
              '$likes',
              { $size: '$comments' },
              '$shares',
              '$bookmarks',
              '$reactions'
            ]
          }
        }
      }
    ]);

    // Get overall stats
    const stats = {
      totalProjects: await Project.countDocuments({ owner: user._id }),
      publishedProjects: await Project.countDocuments({ 
        owner: user._id, 
        status: 'published' 
      }),
      totalViews: projects.reduce((sum, p) => sum + p.views, 0),
      totalEngagement: projects.reduce((sum, p) => sum + p.totalEngagement, 0)
    };

    // Get recent activity
    const recentActivity = await Project.aggregate([
      { $match: { owner: user._id } },
      { $unwind: '$comments' },
      { $sort: { updatedAt: -1 } },
      { $limit: 5 },
      {
        $project: {
          name: 1,
          type: 'comment',
          content: '$comments',
          date: '$updatedAt'
        }
      }
    ]);

    // Get top performing projects
    const topProjects = await Project.find({ owner: user._id })
      .sort({ views: -1 })
      .limit(3)
      .select('name views totalEngagement');

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        stats
      },
      projects,
      recentActivity,
      topProjects
    });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}