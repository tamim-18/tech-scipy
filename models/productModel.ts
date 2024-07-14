// creating product model

import mongoose, { Schema } from "mongoose";
import { ProductModelTypes } from "../types/productModelTypes";
import { ObjectId } from "mongodb";

const productSchema = new Schema<ProductModelTypes>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    // category is an array of objectIds. Each objectId is a category
    // category: [
    //   {
    //     type: ObjectId,
    //     ref: "Category",
    //   },
    // ],
    category: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
      select: false, // this will not be shown in the response
    },
    sold: {
      type: Number,
      default: 0,
      select: false, // this will not be shown in the response
    },
    //color is an array of strings. Each string is a color
    // color: [
    //   {
    //     type: String,
    //     enum: [
    //       "White",
    //       "Black",
    //       "Red",
    //       "Blue",
    //       "Green",
    //       "Yellow",
    //       "Purple",
    //       "Pink",
    //       "Orange",
    //       "Grey",
    //       "Brown",
    //       "Gold",
    //       "Silver",
    //       "Others",
    //     ],
    //   },
    // ],
    color: {
      type: String,
    },
    brand: {
      type: String,
      enum: [
        "Dell",
        "Hp",
        "Lenovo",
        "Asus",
        "Acer",
        "Apple",
        "Samsung",
        "Sony",
        "Microsoft",
        "Toshiba",
        "IBM",
        "Others",
      ],
    },
    images: {
      type: Array,
    },
    // ratings are stored in an array of objects. Each object contains the star rating, comment, and the user who posted the rating
    ratings: [
      {
        star: Number,
        comment: String,
        postedby: {
          type: ObjectId,
          ref: "User",
        },
      },
    ],
    totalrating: {
      type: String,
      default: 0,
    },
  },
  //timestamps
  {
    timestamps: true,
  }
);

////Export the model
export default mongoose.model<ProductModelTypes>("Product", productSchema);
