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

    // Extract shopkeeper ID from session
    const shopkeeperId = session.user.id;

    // Get current date
    const today = new Date();

    // Get date 30 days ago
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    // Fetch cash record for this shopkeeper (you can filter by shopkeeperId if needed)
    const cashDoc = await Cash.findOne({});

    // If no cash record exists, return default response
    if (!cashDoc) {
      return NextResponse.json({
        availableCash: 0,
        cashCollectedHistory: [],
      });
    }

    // Filter and sort cash history entries from the last 30 days (latest first)
    const recentHistory = cashDoc.cashCollectedHistory
      .filter((entry) => {
        const collectedDate = new Date(entry.collectedAt);
        return collectedDate >= thirtyDaysAgo && collectedDate <= today;
      })
      .sort(
        (a, b) =>
          new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime()
      );

    // Return available cash and sorted history
    return NextResponse.json({
      availableCash: cashDoc.availableCash,
      cashCollectedHistory: recentHistory,
    });
  } catch (error: any) {
    // Handle server errors
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
