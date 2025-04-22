import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/DB";
import Cash from "@/models/Cash";

export const POST = async (req: NextRequest) => {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ success: false, message: "ID and status are required." }, { status: 400 });
    }

    await dbConnect();

    const cashRecord = await Cash.findOne();

    if (!cashRecord) {
      return NextResponse.json({ success: false, message: "Cash record not found." }, { status: 404 });
    }

    const cashEntryIndex = cashRecord.cashCollectedHistory.findIndex(
      (entry) => entry._id.toString() === id
    );

    if (cashEntryIndex === -1) {
      return NextResponse.json({ success: false, message: "Cash entry not found." }, { status: 404 });
    }

    if (status === "Received") {
      cashRecord.cashCollectedHistory[cashEntryIndex].status = "Received";
    }

    if (status === "Not Received") {
      const amountToRefund = cashRecord.cashCollectedHistory[cashEntryIndex].cashAmount;
      cashRecord.cashCollectedHistory[cashEntryIndex].status = "Not Received";
      cashRecord.availableCash += amountToRefund;
    }

    await cashRecord.save();

    return NextResponse.json({
      success: true,
      message: `Cash entry status updated to ${status}.`,
    }, { status: 200 });
  } catch (error) {
    console.error("Error updating cash status:", error);
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
    }, { status: 500 });
  }
};
