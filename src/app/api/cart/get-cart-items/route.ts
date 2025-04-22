import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import dbConnect from '@/lib/DB';
import User from '@/models/user';

export async function GET(req: NextRequest) {
  await dbConnect();

  const token = await getToken({ req });

  if (!token?.sub) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized access. Please log in.' },
      { status: 401 }
    );
  }

  const user = await User.findById(token.sub);

  if (!user) {
    return NextResponse.json(
      { success: false, message: 'User not found.' },
      { status: 404 }
    );
  }

  if (user.role !== 'shopkeeper') {
    return NextResponse.json(
      {
        success: false,
        message: `${user.role} is not allowed to access cart items.`,
      },
      { status: 403 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: 'Cart items fetched successfully.',
      cart: user.cart,
    },
    { status: 200 }
  );
}
