import createHttpError from "http-errors";
import blogModel from "../models/blogModel";
import userModel from "../models/userModel";
import e, { Request, Response, NextFunction } from "express";

const createBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newBblog = await blogModel.create(req.body);
    res.json(newBblog);
  } catch (err) {
    return next(createHttpError(500, "Failed to create a blog"));
  }
};

//update a blog
const updateAblog = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const updatedBlog = await blogModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedBlog);
  } catch (err) {
    return next(createHttpError(500, "Failed to update the blog"));
  }
};

export { createBlog, updateAblog };
