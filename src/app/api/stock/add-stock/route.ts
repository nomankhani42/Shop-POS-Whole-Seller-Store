import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/DB";
import Product from "@/models/product";
import Stock from "@/models/Stock"; // Assuming you have a Stock model defined

// Connect to the database first


/**
 * POST /api/stocks
 * Create a new stock entry
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { products } = body;

    // Validate input
    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ message: "Products are required." }, { status: 400 });
    }

    // Prepare products with default status
    const formattedProducts = await Promise.all(
      products.map(async (product: any) => {
        const exists = await Product.findById(product.productId);
        if (!exists) {
          throw new Error(`Invalid productId: ${product.productId}`);
        }

        return {
          productId: product.productId,
          quantity: product.quantity,
          status: "not_received", // default status per product
        };
      })
    );

    // Create stock entry
    const stock = await Stock.create({
      products: formattedProducts,
      stockStatus: "not_received", // overall status
    });

    return NextResponse.json({ success:true,message: "Stock created successfully", stock }, { status: 201 });
  } catch (error: any) {
    console.error("[STOCK_CREATE_ERROR]", error);
    return NextResponse.json({ message: error.message || "Server error" }, { status: 500 });
  }
}
