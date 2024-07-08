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
      type: String,
      default:
        "https://www.istockphoto.com/photo/blog-word-on-wooden-cube-blocks-on-gray-background-gm1440246683-480280906?utm_campaign=srp_photos_top&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fblog&utm_medium=affiliate&utm_source=unsplash&utm_term=blog%3A%3A%3A",
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
