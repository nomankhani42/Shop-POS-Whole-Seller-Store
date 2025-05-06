import { NextResponse } from "next/server";
import dbConnect from "@/lib/DB";
import Product from "@/models/product";

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    await dbConnect();
    const { id } = params;

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
};
