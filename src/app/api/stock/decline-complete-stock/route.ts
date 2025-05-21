import StockModel from "@/models/Stock";
import ProductModel from "@/models/product"
import dbConnect from "@/lib/DB";
import { NextResponse } from "next/server";
import {IStockProduct} from "@/models/Stock"

export const PATCH = async (req: Request) => {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("stock_id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Stock ID is required" }, { status: 400 });
    }

    const stock = await StockModel.findById(id).populate("products.productId");
    if (!stock) {
      return NextResponse.json({ success: false, message: "No Stock Found with this id" }, { status: 404 });
    }

    // Set all products' status to "not_received" if not already "received"
     await Promise.all(
      stock.products.map(async (item: IStockProduct) => {
        if (item.status != "received") {
          const product = await ProductModel.findById(item.productId);
          if (product) {
            
            const findIndex = stock.products.findIndex(
              (i: IStockProduct) => i.productId.toString() === item.productId.toString()
            );
            if (findIndex !== -1) {
              stock.products[findIndex].status = "not_received";
            }
          }
        }
      })
    );

    // If all products are "received", keep stockStatus as "received"
    // If some are "received", and any pending product then partially received
    // if all are none received then not received 
   // Determine stock status
const allReceived = stock.products.every((item: any) => item.status === "received");
const allNotReceived = stock.products.every((item: any) => item.status === "not_received");
const allPending = stock.products.every((item: any) => item.status === "pending");
const someReceived = stock.products.some((item: any) => item.status === "received");
const somePending = stock.products.some((item: any) => item.status === "pending");

if (allReceived) {
  stock.stockStatus = "received";
} else if (allNotReceived) {
  stock.stockStatus = "not_received";
} else if (someReceived && somePending) {
  stock.stockStatus = "pending";
} else if (someReceived) {
  stock.stockStatus = "received_partially";
} else if (allPending) {
  stock.stockStatus = "pending";
} else {
  stock.stockStatus = "not_received";
}

    await stock.save();

    return NextResponse.json({ success: true, message: "Stock declined successfully", stock }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "Server error" }, { status: 500 });
  }
};