import mongoose from "mongoose";

export interface userModelTypes {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  isAdmin?: boolean;
  cart?: any[]; // Assuming 'any' since the schema does not specify the item type
  address?: mongoose.Types.ObjectId[]; // or ObjectId[] if directly using mongodb types
  whistlist?: mongoose.Types.ObjectId[]; // or ObjectId[] if directly using mongodb types
  isBlocked?: boolean;
  refreshToken?: string;
}
