import { Request, Response, NextFunction } from "express";
import createHttpError, { HttpError } from "http-errors";
import categoryModel from "../models/categoryModel";

//creating newcategory
const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title } = req.body; //why name is used here? It is used to get the name of the category from the request body.
    //validating the category is already exist or not
    const category = await categoryModel.findOne({ title });
    if (category) {
      return next(createHttpError(400, "Category already exist"));
    }
    const newCategory = await categoryModel.create(req.body);
    res.json(newCategory);
  } catch (err) {
    return next(createHttpError(500, "Failed to create a category"));
  }
};

export { createCategory };
