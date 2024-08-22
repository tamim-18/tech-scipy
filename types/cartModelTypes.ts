import { Types } from "mongoose";

export interface cartModelTypes {
  products: Array<{
    product: string;
    count: number;
    color: string;
  }>;
  cartTotal: number;
  totalAfterDiscount: number;
  orderedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
