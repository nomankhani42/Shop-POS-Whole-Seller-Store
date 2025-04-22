import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/DB";
import Cash from "@/models/Cash";

export const POST = async (req: NextRequest) => {
  try {
    const { amount, date } = await req.json();

    if (!amount || !date) {
      return NextResponse.json({ message: "Amount and date are required." }, { status: 400 });
    }

    await dbConnect();

    const cashRecord = await Cash.findOne();
    if (!cashRecord) {
      return NextResponse.json({ message: "Cash record not found." }, { status: 404 });
    }

    if (cashRecord.availableCash < amount) {
      return NextResponse.json({ message: "Insufficient available cash." }, { status: 400 });
    }

    // Deduct amount from available cash
    cashRecord.availableCash -= amount;

    // Add to cash history
    cashRecord.cashCollectedHistory.push({
      cashAmount: amount,
      collectedAt: new Date(date),
      status: "Pending",
    });

    await cashRecord.save();

    return NextResponse.json({ message: "Cash settlement request created (Pending)." }, { status: 200 });
  } catch (error) {
    console.error("Cash settlement error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
