import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/AuthOptions";
import dbConnect from "@/lib/DB";
import Cash from "@/models/Cash";

// GET route to fetch available cash and cash history from the last 30 days
export const GET = async () => {
  try {
    // Connect to MongoDB
    await dbConnect();

    // Get authenticated session
    const session = await getServerSession(authOptions);

    // Check if user is logged in and has an ID
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current date
    const today = new Date();

    // Get date 30 days ago
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    // Fetch cash record for this shopkeeper
    const cashDoc = await Cash.findOne({});

    // If no cash record exists, return default response
    if (!cashDoc) {
      return NextResponse.json({
        availableCash: 0,
        cashCollectedHistory: [],
      });
    }

    // Filter cash history entries from the last 30 days
    const recentHistory = cashDoc.cashCollectedHistory.filter((entry) => {
      const collectedDate = new Date(entry.collectedAt);
      return collectedDate >= thirtyDaysAgo && collectedDate <= today;
    });

    // Return available cash and filtered history
    return NextResponse.json({
      availableCash: cashDoc.availableCash,
      cashCollectedHistory: recentHistory,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Handle known errors
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      // Handle unknown errors
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
};
