import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import User from '@/models/User';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyAccessToken } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';

export async function PUT(request) {
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

    const profileData = await request.json();

    if (profileData.profilePicture.startsWith('data:')) {
      const imageUrl = await uploadImage(profileData.profilePicture);
      profileData.profilePicture = imageUrl;
    }

    const user = await User.findByIdAndUpdate(
      userId.id.toString(),
      { $set: profileData },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Profile update failed' }, { status: 500 });
  }
}

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

    const profile = {
      name: user.name,
      email: user.email,
      role: user.role || 'Not specified',
      location: user.location || 'Not specified',
      bio: user.bio || 'No bio yet.',
      website: user.website || '',
      github: user.github || '',
      twitter: user.twitter || '',
      linkedin: user.linkedin || '',
      skills: user.skills || [],
      experience: user.experience || [],
      education: user.education || [],
      stats: user.stats || { projects: 0, contributions: 0, followers: 0, following: 0 },
      profilePicture: user.profilePicture || '/images/default-profile.png',
    };

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}