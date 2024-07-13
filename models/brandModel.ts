import { brandTypes } from "../types/brandTypes";

import { model, Schema } from "mongoose";

const brandSchema = new Schema<brandTypes>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
);

export default model<brandTypes>("Brand", brandSchema);
