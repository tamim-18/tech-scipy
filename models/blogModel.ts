import { Schema, model } from "mongoose";
import { BlogModelTypes } from "../types/blogTypes";

//creating schema of the blog model

const blogSchema = new Schema<BlogModelTypes>(
  {
    title: {
      type: String,
      required: true,
      trim: true, //removes whitespace from both ends of a string
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    category: {
      type: String,
      required: true,
    },
    numViews: {
      type: Number,
      default: 0,
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    isDisliked: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    image: {
      type: Array,
      default: [],
    },
    author: {
      type: String,
      default: "Admin",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, //to include virtual properties when object is converted to JSON
    toObject: { virtuals: true }, //to include virtual properties when object is converted to object
  }
);

//exporting the blog model
export default model<BlogModelTypes>("Blog", blogSchema);
