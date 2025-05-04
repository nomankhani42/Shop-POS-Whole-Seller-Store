import { NextRequest, NextResponse } from "next/server";
import type { RouteHandlerContext } from "next/dist/server/web/types"; // ✅ CORRECT TYPE

import dbConnect from "@/lib/DB";
import CategoryModel from "@/models/category";

export async function DELETE(
  req: NextRequest,
  context: RouteHandlerContext
) {
  await dbConnect();

  const id = context.params?.id;

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Category ID is required" },
      { status: 400 }
    );
  }

  try {
    const deletedCategory = await CategoryModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
