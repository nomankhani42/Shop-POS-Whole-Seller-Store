import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/DB";
import CategoryModel from "@/models/category";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json(); // Parse JSON request body
    const { title, img } = body;

    if (!title || !img) {
      return NextResponse.json(
        { success: false, message: "Title and Image URL are required" },
        { status: 400 }
      );
    }

    // Save category to DB
    const newCategory = await CategoryModel.create({ title, img });

    return NextResponse.json(
      { success: true, message: "Category created successfully", category: newCategory },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
