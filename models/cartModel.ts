import mongoose from "mongoose";
import { cartModelTypes } from "../types/cartModelTypes";

const cartSchema = new mongoose.Schema<cartModelTypes>(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        count: {
          type: Number,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
      },
    ],
    cartTotal: {
      type: Number,
      required: true,
    },
    totalAfterDiscount: Number, // This field is optional
    orderedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<cartModelTypes>("Cart", cartSchema);
