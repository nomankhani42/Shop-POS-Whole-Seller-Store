import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/product";
import dbConnect from "@/lib/DB";
import type { RouteContext } from "next";

export async function PUT(
  req: NextRequest,
  context: RouteContext<{ id: string }>
) {
  await dbConnect();

  const productId = context.params.id;

  try {
    const updatedData = await req.json();

    if (!updatedData || Object.keys(updatedData).length === 0) {
      return NextResponse.json({ success: false, message: "No update data provided." }, { status: 400 });
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });

    if (!updatedProduct) {
      return NextResponse.json({ success: false, message: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
