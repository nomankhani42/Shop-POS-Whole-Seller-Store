import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/DB';
import User from '@/models/user';
import ProductModel from '@/models/product';
import { getToken } from "next-auth/jwt"; // ✅ Ensure this is correctly imported

export async function PUT(req: NextRequest) {
  await dbConnect();

  const token = await getToken({ req }); // ✅ Use getToken to extract the token
  if (!token?.sub) {
    return NextResponse.json({ success: false, message: 'Unauthorized. Please log in.' }, { status: 401 });
  }

  const { product_id } = await req.json();

  const user = await User.findById(token.sub);
  if (!user) {
    return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
  }

  if (user.role !== 'shopkeeper') {
    return NextResponse.json({ success: false, message: 'Only shopkeepers can update cart.' }, { status: 403 });
  }

  const product = await ProductModel.findById(product_id);
  if (!product) {
    return NextResponse.json({ success: false, message: 'Product not found.' }, { status: 404 });
  }

  if (product.stock < 1) {
    return NextResponse.json({ success: false, message: 'No more stock available for this product.' }, { status: 400 });
  }

  const cartItemIndex = user.cart.findIndex(item => item.productId.equals(product._id));

  if (cartItemIndex === -1) {
    return NextResponse.json({ success: false, message: 'Product not found in cart.' }, { status: 404 });
  }

  // ✅ Increase quantity in cart
  user.cart[cartItemIndex].quantity += 1;

  // ✅ Decrease stock
  product.stock -= 1;

  await user.save();
  await product.save();

  return NextResponse.json({
    success: true,
    message: 'Product quantity increased in cart.',
    cart: user.cart,
  }, { status: 200 });
}