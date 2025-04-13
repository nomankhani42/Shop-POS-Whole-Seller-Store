import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  name: string;
  price: number;
}

export interface IUser extends Document {
  name: string;
  username: string;
  password: string; // 👈 Password added
  role: 'owner' | 'shopkeeper';
  storeName: string;
  cart: ICartItem[];
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
    password: {
      type: String,
      required: true, // 👈 Password is required
    },
    role: {
      type: String,
      enum: ['owner', 'shopkeeper'],
      default: 'owner',
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
          ref: 'Product',
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
