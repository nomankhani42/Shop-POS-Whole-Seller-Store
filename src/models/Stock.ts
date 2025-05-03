// src/models/Stock.ts (or .js if you're using JavaScript)

import mongoose, { Schema, Document, Types, model, models } from "mongoose";

// Interface for a single product in the stock
interface IStockProduct {
  productId: Types.ObjectId;         // Ref to Product
  quantity: number;                 // Expected quantity
  status: "received" | "not_received"; // Per-product status
}

// Interface for Stock document
export interface IStock extends Document {
  products: IStockProduct[];
  stockStatus: "received" | "partially_received" | "not_received";
  createdAt: Date;
  updatedAt: Date;
}

const StockProductSchema = new Schema<IStockProduct>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    status: {
      type: String,
      enum: ["received", "not_received"],
      default: "not_received",
    },
  },
  { _id: false }
);

const StockSchema = new Schema<IStock>(
  {
    products: {
      type: [StockProductSchema],
      required: true,
    },
    stockStatus: {
      type: String,
      enum: ["received", "partially_received", "not_received"],
      default: "not_received",
    },
  },
  { timestamps: true }
);

export default models.Stock || mongoose.model<IStock>("Stock", StockSchema);
