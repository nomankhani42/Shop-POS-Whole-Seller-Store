import { NextRequest, NextResponse } from "next/server";
import type { NextApiResponse } from "next";
import type { NextRequest as NextReq, NextResponse as NextRes } from "next/server";
import dbConnect from "@/lib/DB";
import CategoryModel from "@/models/category";

// ✅ Import RouteHandlerContext from next
import type { NextApiRequest } from "next";
import type { RouteHandlerContext } from "next/dist/server/web/types";

export async function DELETE(
  req: NextRequest,
  context: RouteHandlerContext<{ id: string }>
) {
  await dbConnect();

  const id = context.params.id;

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
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
