import { NextResponse } from 'next/server';
import dbConnect from '@/lib/DB';
import User from '@/models/user';
import ProductModel from '@/models/product';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function DELETE(req: NextRequest) {
  await dbConnect();

  const token = await getToken({ req });
  if (!token?.sub) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized. Please log in.' },
      { status: 401 }
    );
  }

  const { product_id } = await req.json();

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
        message: `${user.role} is not allowed to modify the cart.`,
      },
      { status: 403 }
    );
  }

  // Find the index of the product in the cart
  const cartItemIndex = user.cart.findIndex((item) =>
    item.productId.equals(product_id)
  );

  if (cartItemIndex === -1) {
    return NextResponse.json(
      { success: false, message: 'Product not found in cart.' },
      { status: 404 }
    );
  }

  // Get quantity to restore
  const quantityToRestore = user.cart[cartItemIndex].quantity;

  // Find the product and restore stock
  const product = await ProductModel.findById(product_id);
  if (product) {
    product.stock += quantityToRestore;
    await product.save();
  }

  // Remove the product from the user's cart
  user.cart.splice(cartItemIndex, 1);
  await user.save();

  return NextResponse.json(
    {
      success: true,
      message: 'Product removed from cart successfully.',
      cart: user.cart,
    },
    { status: 200 }
  );
}
