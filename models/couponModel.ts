import mongoose, { Schema } from "mongoose";
import { couponModelTypes } from "../types/couponTypes";

const couponSchema = new Schema<couponModelTypes>({
  name: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  expiry: {
    type: Date,
    require: true,
  },
  discount: {
    type: Number,
    required: true,
  },
});

export default mongoose.model<couponModelTypes>("Coupons", couponSchema);
