// src/models/Stock.ts (or .js if you're using JavaScript)

import mongoose, { Schema, Document, Types, models } from "mongoose";

// Interface for a single product in the stock
interface IStockProduct {
  productId: Types.ObjectId; // Ref to Product
  quantity: number; // Expected quantity
  status: "pending" | "received" | "not_received"; // Per-product status
}

// Interface for Stock document
export interface IStock extends Document {
  _id: string;
  products: IStockProduct[];
  stockStatus: "pending" | "received" | "not_received";
  createdAt: Date;
  updatedAt: Date;
}

// Schema for a single product in the stock
const StockProductSchema = new Schema<IStockProduct>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "received", "not_received"], // Ensure "pending" is included
      default: "pending",
    },
  },
  { _id: false } // Disable _id for subdocuments
);

// Schema for the Stock document
const StockSchema = new Schema<IStock>(
  {
    products: {
      type: [StockProductSchema],
      required: true,
    },
    stockStatus: {
      type: String,
      enum: ["pending", "received", "not_received"], // Ensure "pending" is included
      default: "pending",
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

export default models.Stock || mongoose.model<IStock>("Stock", StockSchema);
