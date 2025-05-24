import { NextRequest, NextResponse } from "next/server"; // Import Next.js API types
import dbConnect from "@/lib/DB"; // Custom DB connection utility
import SalesTransaction from "@/models/SaleTransication";
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  endOfDay,
  endOfWeek,
  endOfMonth,
} from "date-fns"; // Utility functions to calculate start/end of day/week/month

export const GET = async (req: NextRequest) => {
  try {
    await dbConnect(); // Connect to MongoDB

    const now = new Date(); // Get the current date/time

    // Calculate today's start and end timestamps
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);

    // Calculate the start and end of the current week (starts on Monday)
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    // Calculate the start and end of the current month
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    // Fetch all transactions and sort by latest (newest first)
    const allTransactions = await SalesTransaction.find().sort({ createdAt: -1 });

    // Filter today's transactions and sum netAmount
    const todaySales = allTransactions
      .filter((t) => t.createdAt >= todayStart && t.createdAt <= todayEnd)
      .reduce((acc, t) => acc + t.netAmount, 0);

    // Filter weekly transactions and sum netAmount
    const weeklySales = allTransactions
      .filter((t) => t.createdAt >= weekStart && t.createdAt <= weekEnd)
      .reduce((acc, t) => acc + t.netAmount, 0);

    // Filter monthly transactions and sum netAmount
    const monthlySales = allTransactions
      .filter((t) => t.createdAt >= monthStart && t.createdAt <= monthEnd)
      .reduce((acc, t) => acc + t.netAmount, 0);

    // Build product quantity map
    const productMap: Record<string, { name: string; quantity: number }> = {};

    allTransactions.forEach((t) => {
      t.products.forEach((product) => {
        if (productMap[product.productId]) {
          productMap[product.productId].quantity += product.quantity;
        } else {
          productMap[product.productId] = {
            name: product.name,
            quantity: product.quantity,
          };
        }
      });
    });

    // Create most sold product list
    const mostSoldProducts = Object.entries(productMap)
      .map(([productId, data]) => ({
        productId,
        name: data.name,
        quantitySold: data.quantity,
      }))
      .sort((a, b) => b.quantitySold - a.quantitySold); // Most sold first

    // Return response
    return NextResponse.json({
      success: true,
      todaySales,
      weeklySales,
      monthlySales,
      mostSoldProducts,
      allTransactions, // already sorted latest first
    });
  } catch (error) {
    console.error("Error in sales overview API:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
