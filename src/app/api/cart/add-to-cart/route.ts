import { NextResponse } from 'next/server';
import dbConnect from '@/lib/DB';
import User from '@/models/user';
import ProductModel from '@/models/product';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import mongoose from 'mongoose';

interface CartItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  name: string;
  price: number;
}

export async function POST(req: NextRequest) {
  await dbConnect();

  const token = await getToken({ req });
  if (!token?.sub) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized. Please log in.' },
      { status: 401 }
    );
  }

  const { product_id } = await req.json();

  // Find the user
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
        message: `${user.role} is not allowed to add to cart.`,
      },
      { status: 403 }
    );
  }

  // Find the product
  const product = await ProductModel.findById(product_id);
  if (!product) {
    return NextResponse.json(
      {
        success: false,
        message: `Product not found.`,
      },
      { status: 404 }
    );
  }

  if (product.stock < 1) {
    return NextResponse.json(
      {
        success: false,
        message: `No more stock available for this product.`,
      },
      { status: 400 }
    );
  }

  // Check if product already exists in user's cart
  const existingCartItemIndex = user.cart.findIndex((item: CartItem) =>
    item.productId.equals(product._id)
  );

  if (existingCartItemIndex !== -1) {
    // Update quantity if exists
    user.cart[existingCartItemIndex].quantity += 1;
  } else {
    // Add new item to cart
    user.cart.push({
      productId: product._id,
      quantity: 1,
      name: product.name,
      price: product.sellingPrice,
    });
  }

  // ✅ Decrease product stock
  product.stock -= 1;
  await product.save();

  // Save user cart
  await user.save();

  return NextResponse.json(
    {
      success: true,
      message: 'Product added to cart successfully.',
      cart: user.cart,
    },
    { status: 200 }
  );
}
