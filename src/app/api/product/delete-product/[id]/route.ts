import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/DB";
import Product from "@/models/product";

// Make sure the correct function signature is used
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Connect to the database
    await dbConnect();

    const { id } = params;

    // If no ID is provided, return a bad request error
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Attempt to delete the product from the database
    const deletedProduct = await Product.findByIdAndDelete(id);

    // If the product doesn't exist, return a not found error
    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // If successful, return a success response
    return NextResponse.json(
      { success: true, message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    // Log and handle any internal server errors
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
