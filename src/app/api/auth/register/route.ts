import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/DB';
import User from '@/models/user';
import bcrypt from 'bcryptjs';

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();

    const body = await req.json();
    const { name, username, password, storeName } = body;

    if (!name || !username || !password ) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Username already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      username,
      password: hashedPassword,
      
      storeName: storeName || 'My Wholesaler Store',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        user: {
          _id: newUser._id,
          name: newUser.name,
          username: newUser.username,
          role: newUser.role,
          storeName: newUser.storeName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('User registration failed:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
