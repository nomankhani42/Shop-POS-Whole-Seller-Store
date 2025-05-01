import connectDB from "@/utils/db"; // MongoDB connection utility
import Stock from "@/models/Stock";        // Stock model
import { NextRequest, NextResponse } from "next/server";

// Connect to MongoDB before handling the request


/**
 * GET /api/stocks
 * Fetch all stock entries with populated product data
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    // Fetch all stock documents and populate the productId field with actual product data
    const stocks = await Stock.find();

    return NextResponse.json({ success:true,stocks,message:"Stocks Data Getted Successfully", }, { status: 200 });
  } catch (error: any) {
    console.error("[GET_STOCKS_ERROR]", error);
    return NextResponse.json({ message: error.message || "Server error" }, { status: 500 });
  }
}
