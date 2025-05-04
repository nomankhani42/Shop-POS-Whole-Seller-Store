import { NextResponse } from "next/server";
import dbConnect from "@/lib/DB";
import Product from "@/models/product";
import type { NextRequest } from "next/server";
import type { RouteContext } from "next";

export async function GET(
  req: NextRequest,
  context: RouteContext<{ id: string }>
) {
  try {
    await dbConnect();
    const { id } = context.params;

    if (!id) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
