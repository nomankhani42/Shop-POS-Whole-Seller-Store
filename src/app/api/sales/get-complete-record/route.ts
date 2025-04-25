import { NextRequest, NextResponse } from "next/server"; // Import Next.js API types
import dbConnect from "@/lib/DB"; // Custom DB connection utility
import SalesTransaction from "@/models/SaleTransication"
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
    const todayStart = startOfDay(now); // Example: 2025-04-22T00:00:00.000Z
    const todayEnd = endOfDay(now);     // Example: 2025-04-22T23:59:59.999Z

    // Calculate the start and end of the current week (starts on Monday)
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    // Calculate the start and end of the current month
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    // Fetch ALL sales transactions from the database
    const allTransactions = await SalesTransaction.find();

    // Filter transactions for today, and sum the netAmount of each
    const todaySales = allTransactions
      .filter((t) => t.createdAt >= todayStart && t.createdAt <= todayEnd) // Only today's
      .reduce((acc, t) => acc + t.netAmount, 0); // Sum netAmount

    // Filter transactions for this week, then sum netAmount
    const weeklySales = allTransactions
      .filter((t) => t.createdAt >= weekStart && t.createdAt <= weekEnd)
      .reduce((acc, t) => acc + t.netAmount, 0);

    // Filter transactions for this month, then sum netAmount
    const monthlySales = allTransactions
      .filter((t) => t.createdAt >= monthStart && t.createdAt <= monthEnd)
      .reduce((acc, t) => acc + t.netAmount, 0);

    // Prepare a map to count how many quantities of each product were sold
    const productMap: Record<
      string,
      { name: string; quantity: number }
    > = {};

    // Loop through every transaction
    allTransactions.forEach((t) => {
      // Loop through each product in that transaction
      t.products.forEach((product) => {
        // If product already exists in the map, increase its quantity
        if (productMap[product.productId]) {
          productMap[product.productId].quantity += product.quantity;
        } else {
          // Else, add it to the map with initial data
          productMap[product.productId] = {
            name: product.name,
            quantity: product.quantity,
          };
        }
      });
    });

    // Convert productMap into an array and sort by quantity in descending order
    const mostSoldProducts = Object.entries(productMap)
      .map(([productId, data]) => ({
        productId,
        name: data.name,
        quantitySold: data.quantity,
      }))
      .sort((a, b) => b.quantitySold - a.quantitySold); // Most sold on top

    // Send the response JSON with all calculated results
    return NextResponse.json({
      success: true,          // Request was successful
      todaySales,             // Today's net sales
      weeklySales,            // This week's net sales
      monthlySales,           // This month's net sales
      mostSoldProducts,       // Most sold products by quantity
      allTransactions,        // All transactions data
    });
  } catch (error) {
    console.error("Error in sales overview API:", error); // Log any error
    return NextResponse.json(
      { success: false, message: "Internal Server Error" }, // Send error response
      { status: 500 }
    );
  }
};
