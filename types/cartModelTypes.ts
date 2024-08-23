import { Types } from "mongoose";

export interface cartModelTypes {
  products: Array<{
    product: Types.ObjectId; // Reference to another document
    count: number;
    color: string;
  }>;
  cartTotal: number;
  totalAfterDiscount?: number; // Optional field
  orderedBy: Types.ObjectId; // Reference to a User document
  createdAt: Date;
  updatedAt: Date;
}
