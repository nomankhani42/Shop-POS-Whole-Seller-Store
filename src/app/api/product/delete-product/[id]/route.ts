import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/DB";
import Product from "@/models/product";
import type { NextRequest } from "next/server";
import type { RouteContext } from "next";

export async function DELETE(
  req: NextRequest,
  context: RouteContext<{ id: string }>
) {
  try {
    await dbConnect();

    const { id } = context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
