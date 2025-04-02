import { NextResponse } from "next/server";
import dbConnect from "@/lib/DB";
import CategoryModel from "@/models/category";

// ✅ Get All Categories API Route (GET)
export async function GET() {
  await dbConnect(); // ✅ Connect to MongoDB

  try {
    const categories = await CategoryModel.find().sort({ createdAt: -1 }); // ✅ Fetch all categories, newest first

    return NextResponse.json({ success: true, categories }, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
