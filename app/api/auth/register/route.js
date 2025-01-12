// app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcrypt';

// app/api/auth/register/route.js
export async function POST(request) {
  try {
    await connectToDatabase();

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    
    // Debug before save
    console.log('=== Debug Registration ===');
    console.log('Password before hash:', password);
    console.log('Generated hash:', hashedPassword);
    console.log('Verify before save:', await bcrypt.compare(password, hashedPassword));

    // Create and save user ONCE
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    console.log('User before save:', user);

    // Save only once
    await user.save()
    // Verify after save
    const savedUser = await User.findOne({ email }).lean(); // Use lean() to get plain object
    console.log('Stored hash:', savedUser.password);
    console.log('Verify after save:', await bcrypt.compare(password, savedUser.password));

    return NextResponse.json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}