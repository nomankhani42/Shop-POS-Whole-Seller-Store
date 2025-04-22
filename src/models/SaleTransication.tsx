// models/SalesTransaction.ts

import mongoose, { Schema, Document, Types } from "mongoose";

interface IProductItem {
  productId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface ISalesTransaction extends Document {
  customerName: string;
  customerPhone?: string;
  products: IProductItem[];
  netAmount: number;
  paymentMethod: "cash" | "card" | "easypaisa" | "jazzcash";
//   createdBy: Types.ObjectId; // Shopkeeper
  createdAt: Date;
  updatedAt: Date;
}

const ProductItemSchema = new Schema<IProductItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { _id: false }
);

const SalesTransactionSchema = new Schema<ISalesTransaction>(
  {
    customerName: { type: String, required: true },
    customerPhone: { type: String },
    products: [ProductItemSchema],
    netAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "easypaisa", "jazzcash"],
      default: "cash",
    },
    // createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

export default mongoose.models.SalesTransaction ||
  mongoose.model<ISalesTransaction>("SalesTransaction", SalesTransactionSchema);
