import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/DB";
import CategoryModel from "@/models/category";

// Corrected parameter typing
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await dbConnect();

  try {
    const id = context.params.id;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Category ID is required" },
        { status: 400 }
      );
    }

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
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
