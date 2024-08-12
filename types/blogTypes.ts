// creating types of blog model

import e from "express";
import { Types } from "mongoose";

// interface of the blog model
export interface BlogModelTypes {
  title: string;
  description: string;
  category: string;
  numViews: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  likes?: Types.ObjectId[];
  dislikes?: Types.ObjectId[];
  image?: Array<{ public_id: string; url: string }>;
  author?: string;
}
