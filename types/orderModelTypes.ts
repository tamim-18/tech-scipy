import { Document, ObjectId } from "mongoose";

export interface ProductOrder {
  product: ObjectId;
  count: number;
  color: string;
}

export interface orderModelTypes extends Document {
  products: ProductOrder[];
  paymentIntent: any; // You can replace `any` with the appropriate type if you have one
  orderStatus:
    | "Not Processed"
    | "Processing"
    | "Dispatched"
    | "Cancelled"
    | "Completed"
    | "Cash On Delivery";
  orderedBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
