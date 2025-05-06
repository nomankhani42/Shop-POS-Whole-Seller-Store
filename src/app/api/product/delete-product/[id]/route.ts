import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/DB";
import Product from "@/models/product";

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await dbConnect();
    
    const { id } = params;
    if (!id) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
};
