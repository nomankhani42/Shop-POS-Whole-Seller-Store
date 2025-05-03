import { NextResponse } from "next/server";
import dbConnect from "@/lib/DB";
import SaleTransaction from "@/models/SaleTransication";
import Cash from "@/models/Cash";
import User from "@/models/user";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const {
      customerName,
      customerPhone,
      products,
      netAmount,
      paymentMethod = "cash",
      userId, // Assuming you're sending this from frontend
    } = body;

    if (
      !customerName ||
      !products ||
      !Array.isArray(products) ||
      products.length === 0 ||
      !netAmount ||
      !userId
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Record sale
    const newSale = await SaleTransaction.create({
      customerName,
      customerPhone,
      products,
      netAmount,
      paymentMethod,
    });

    // 2. Update cash
    let cashData = await Cash.findOne();

    if (!cashData) {
      cashData = await Cash.create({
        availableCash: netAmount,
        cashCollectedHistory: [],
        cashGivenToOwnerHistory: [],
      });
    } else {
      cashData.availableCash += netAmount;
      await cashData.save();
    }

    // 3. Clear user's cart
    const userDoc = await User.findById(userId);
    if (userDoc) {
      userDoc.cart = []; // Assuming `cart` is an array field in User model
      await userDoc.save();
    }

    return NextResponse.json({
      message: "Sale recorded, cash updated, and cart emptied successfully",
      sale: newSale,
      updatedCash: cashData,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Error in /api/sales/proceed:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("❌ Unknown error in /api/sales/proceed:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
}
