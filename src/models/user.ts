import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  productId: mongoose.Types.ObjectId; // Reference to the Product model
  quantity: number; // Quantity of the product in the cart
  name: string; // Name of the product (you can store it here to avoid additional queries)
  price: number; // Selling price of the product
}

export interface IUser extends Document {
  name: string;
  username: string;
  role: 'owner' | 'shopkeeper';
  storeName: string;
  cart: ICartItem[]; // Cart field added
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['owner', 'shopkeeper'],
      required: true,
    },
    storeName: {
      type: String,
      required: true,
      default: 'My Wholesaler Store',
    },
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product', // Assuming there's a Product model you want to reference
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);
