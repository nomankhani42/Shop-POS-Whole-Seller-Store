import dbConnect from "@/lib/DB";
import Stock from "@/models/Stock"; // Stock model
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Extract the 'id' from the query string
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Stock ID is required" }, { status: 400 });
    }

    // Fetch the stock entry by ID
    const stock = await Stock.findById(id).populate("products.productId");// Populate the productId field with actual product data

    if (!stock) {
      return NextResponse.json({ success: false, message: "Stock not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, stock, message: "Stock Data Retrieved Successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("[GET_STOCK_ERROR]", error);
    return NextResponse.json({ success: false, message: error.message || "Server error" }, { status: 500 });
  }
}