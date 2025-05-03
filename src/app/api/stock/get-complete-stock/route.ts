import dbConnect from "@/lib/DB";
import Stock from "@/models/Stock"; // Stock model
import { NextResponse } from "next/server";

/**
 * GET /api/stocks
 * Fetch all stock entries with populated product data
 */
export async function GET() {
  try {
    await dbConnect();
    // Fetch all stock documents
    const stocks = await Stock.find();

    return NextResponse.json(
      { success: true, stocks, message: "Stocks Data Retrieved Successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("[GET_STOCKS_ERROR]", error.message);
      return NextResponse.json(
        { success: false, message: error.message || "Server error" },
        { status: 500 }
      );
    } else {
      console.error("[GET_STOCKS_ERROR] Unknown error:", error);
      return NextResponse.json(
        { success: false, message: "Unknown server error" },
        { status: 500 }
      );
    }
  }
}
