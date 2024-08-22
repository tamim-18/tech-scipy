import mongoose from "mongoose";
import { orderModelTypes } from "../types/orderModelTypes";

const orderSchema = new mongoose.Schema<orderModelTypes>(
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
    paymentIntent: {},
    orderStatus: {
      type: String,
      default: "Not Processed",
      enum: [
        "Not Processed",
        "Processing",
        "Dispatched",
        "Cancelled",
        "Completed",
        "Cash On Delivery",
      ],
    },
    orderedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model<orderModelTypes>("Order", orderSchema);
