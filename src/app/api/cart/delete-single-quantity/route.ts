import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/DB';
import User from '@/models/user';
import ProductModel from '@/models/product';
import { getToken } from 'next-auth/jwt';

export async function PUT(req: NextRequest) {
  await dbConnect();

  const token = await getToken({ req });
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

  const cartItemIndex = user.cart.findIndex(item => item.productId.equals(product._id));

  if (cartItemIndex === -1) {
    return NextResponse.json({ success: false, message: 'Product not in cart.' }, { status: 404 });
  }

  const cartItem = user.cart[cartItemIndex];

  // ✅ If quantity is 1, remove the item from cart
  if (cartItem.quantity === 1) {
    user.cart.splice(cartItemIndex, 1);
  } else {
    // ✅ Else, just decrease the quantity
    cartItem.quantity -= 1;
  }

  // ✅ Increase the product stock
  product.stock += 1;

  await user.save();
  await product.save();

  return NextResponse.json({
    success: true,
    message: 'Product quantity decreased in cart.',
    cart: user.cart,
  }, { status: 200 });
}
