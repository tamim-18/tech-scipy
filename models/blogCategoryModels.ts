import { blogCategoryTypes } from "../types/blogCategory";

import { model, Schema } from "mongoose";

const blogCategorySchema = new Schema<blogCategoryTypes>(
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

export default model<blogCategoryTypes>("BlogCategory", blogCategorySchema);
