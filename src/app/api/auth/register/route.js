import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    // Connect to database
    await dbConnect();
    
    // Parse request body
    const { name, email, password } = await request.json();

    console.log('Registration attempt for:', email);

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password manually
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('Password hashed successfully');

    // Create new user with hashed password
    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword 
    });

    console.log('User created successfully:', user.email);

    // Return success response (without password)
    return NextResponse.json(
      { 
        success: true,
        message: 'User created successfully', 
        user: { 
          id: user._id.toString(), 
          name: user.name, 
          email: user.email 
        } 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration API error details:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    // Handle specific MongoDB errors
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: errors.join(', ') },
        { status: 400 }
      );
    }

    // Generic error
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}