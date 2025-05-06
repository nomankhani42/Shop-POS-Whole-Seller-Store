import { NextResponse } from "next/server";
import dbConnect from "@/lib/DB";
import CategoryModel from "@/models/category";

export async function PUT(req: Request, { params }: { params: { id?: string } }) {
  await dbConnect();

  try {
    const id = params?.id;
    if (!id) {
      return NextResponse.json({ success: false, message: "Category ID is required" }, { status: 400 });
    }

    const { title, img } = await req.json(); // ✅ Parse JSON input

    if (!title) {
      return NextResponse.json({ success: false, message: "Title is required" }, { status: 400 });
    }

    // ✅ Update Category in MongoDB
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      { title, img }, // ✅ Directly use the received image URL
      { new: true }
    );

    if (!updatedCategory) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Category updated successfully", category: updatedCategory }, { status: 200 });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
