import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/DB';
import ProductModel  from '@/models/product';

// Fetch all products
export const GET = async (req: NextRequest) => {
  try {
    await dbConnect();
    const products = await ProductModel.find().sort({ createdAt: -1 }); // Fetch latest products first

    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch products', error: error.message }, { status: 500 });
  }
};
