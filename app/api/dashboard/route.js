import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // Import cookies
import { connectToDatabase } from '@/lib/mongodb';
import Project from '@/models/Project';
import User from '@/models/User';
import { verifyAccessToken } from '@/lib/auth'; // Import your JWT verification function

export async function GET(request) {
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

    const user = await User.findById(userId.id.toString());

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

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
      totalViews: projects.reduce((sum, p) => sum + (p.views || 0), 0), // Handle null views
      totalEngagement: projects.reduce((sum, p) => sum + (p.totalEngagement || 0), 0) // Handle null engagement
    };

    // Get recent activity (handle null comments)
    const recentActivity = await Project.aggregate([
      { $match: { owner: user._id } },
      { $unwind: { path: '$comments', preserveNullAndEmptyArrays: true } }, // Preserve null comments
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