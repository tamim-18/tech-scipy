import mongoose from "mongoose";
import { userModelTypes } from "../types/userModelTypes";

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema<userModelTypes>(
  {
    fisrtName: {
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
  },
  //timestamps
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("User", userSchema);
