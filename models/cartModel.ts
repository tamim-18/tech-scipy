import mongoose from "mongoose";
import { cartModelTypes } from "../types/cartModelTypes";

const cartShema = new mongoose.Schema<cartModelTypes>(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        count: Number,
        color: String,
      },
    ],
    cartTotal: Number,
    totalAfterDiscount: Number,
    orderedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<cartModelTypes>("Cart", cartShema);
