import { NextResponse } from "next/server";
import dbConnect from "@/lib/DB";
import CategoryModel from "@/models/category";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await dbConnect(); // ✅ Connect to MongoDB

  try {
    const id = params?.id; // ✅ Extract category ID from URL params

    if (!id) {
      return NextResponse.json({ success: false, message: "Category ID is required" }, { status: 400 });
    }

    // ✅ Find and delete the category
    const deletedCategory = await CategoryModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Category deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
