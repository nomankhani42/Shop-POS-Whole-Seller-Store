import { NextRequest, NextResponse } from "next/server";
import type { NextApiRequestContext } from "next";

import dbConnect from "@/lib/DB";
import CategoryModel from "@/models/category";

export async function PUT(
  req: NextRequest,
  context: NextApiRequestContext
): Promise<NextResponse> {
  await dbConnect();

  const id = context.params?.id;

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Category ID is required" },
      { status: 400 }
    );
  }

  try {
    const { title, img } = await req.json(); // ✅ Parse JSON input

    if (!title) {
      return NextResponse.json(
        { success: false, message: "Title is required" },
        { status: 400 }
      );
    }

    // ✅ Update Category in MongoDB
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      { title, img }, // ✅ Update with received image URL and title
      { new: true }
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Category updated successfully", category: updatedCategory },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
