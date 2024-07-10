import { CategoryModelTypes } from "./../types/categoryTypes";
import { model, Schema } from "mongoose";

const categorySchema = new Schema<CategoryModelTypes>(
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

export default model<CategoryModelTypes>("Category", categorySchema);
