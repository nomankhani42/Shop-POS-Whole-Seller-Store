import dbConnect from "@/lib/DB";
import Stock from "@/models/Stock"; // Stock model
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/stocks
 * Fetch all stock entries sorted by latest (newest first)
 */
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Fetch all stocks sorted by latest and optionally populate productId
    const stocks = await Stock.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        stocks,
        message: "Stocks Data Fetched Successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[GET_STOCKS_ERROR]", error);
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
