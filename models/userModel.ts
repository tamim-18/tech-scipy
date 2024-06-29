import mongoose from "mongoose";
import { userModelTypes } from "../types/userModelTypes";
import { ObjectId } from "mongodb";

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema<userModelTypes>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    cart: {
      type: Array,
      default: [],
    },
    address: [
      {
        type: ObjectId,
        ref: "Address",
      },
    ],
    whistlist: [
      {
        type: ObjectId,
        ref: "Product",
      },
    ],
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  //timestamps
  {
    timestamps: true,
  }
);

//Export the model
export default mongoose.model<userModelTypes>("User", userSchema);
