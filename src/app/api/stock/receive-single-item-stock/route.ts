import StockModel from '@/models/stock';
import ProductModel from '@/models/product';
import dbConnect from '@/lib/DB';
import { NextResponse } from 'next/server';
import { IStockProduct } from '@/models/stock';

export const PATCH = async (req: Request) => {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const product_id = searchParams.get("p_id");
    const stock_id = searchParams.get("stock_id");

    // Validate query parameters
    if (!product_id || !stock_id) {
      return NextResponse.json(
        { success: false, message: "Product ID and Stock ID are required" },
        { status: 400 }
      );
    }

    // Find stock by stock ID and embedded product ID
    const stock = await StockModel.findOne({
      _id: stock_id,
      "products.productId": product_id,
    }).populate("products.productId");

    if (!stock) {
      return NextResponse.json(
        { success: false, message: "No stock found with the given IDs" },
        { status: 404 }
      );
    }

    // Find the specific product in the stock's product array
    const stockProduct = stock.products.find(
      (item: IStockProduct) => item.productId._id.toString() === product_id
    );

    if (!stockProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found in stock" },
        { status: 404 }
      );
    }

    // Update main product quantity
    const product = await ProductModel.findById(product_id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found in database" },
        { status: 404 }
      );
    }

    product.stock += stockProduct.quantity;
    await product.save();

    // Update the product status inside stock document
    stockProduct.status = "received";

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

    return NextResponse.json({
      success: true,
      message: "Stock status updated successfully",
      stock,
    }, { status: 200 });

  } catch (error: any) {
    console.error("PATCH error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};
