import { Types } from "mongoose";

// interface of the product model
export interface ProductModelTypes {
  title: string;
  slug: string;
  description: string;
  price: number;
  // category: Types.ObjectId[];
  category: string;
  brand: string;
  quantity: number;
  sold?: number;
  images?: Array<{ public_id: string; url: string }>;
  // color?: string[];
  color?: string;
  tags?: string;
  ratings?: Array<{
    star: number;
    comment: string;
    postedby: Types.ObjectId;
  }>;
  totalrating?: string;
}
