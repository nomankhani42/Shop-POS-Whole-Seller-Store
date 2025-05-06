import mongoose, { Schema, model, Document, models } from "mongoose";

// Define Category Type
interface ICategory extends Document {
  title: string;
  img: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define Schema
const categorySchema = new Schema<ICategory>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    img: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt & updatedAt automatically
  }
);

// Ensure we do not recompile the model if it already exists
const CategoryModel = models.Category || model<ICategory>("Category", categorySchema);

export default CategoryModel;
