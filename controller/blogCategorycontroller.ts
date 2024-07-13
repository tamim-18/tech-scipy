import { Request, Response, NextFunction } from "express";
import createHttpError, { HttpError } from "http-errors";
import categoryModel from "../models/blogCategoryModels";

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
// update a category
const updateAcategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  console.log(id);

  try {
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedCategory) {
      return next(createHttpError(404, "Category not found"));
    }
    res.json(updatedCategory);
  } catch (err) {
    return next(createHttpError(500, "Failed to update the category!!"));
  }
};
//delete a category
const deleteAcategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  console.log(id);

  try {
    const deletedCategory = await categoryModel.findByIdAndDelete(id);
    if (!deletedCategory) {
      return next(createHttpError(404, "Category not found"));
    }
    res.json(deletedCategory);
  } catch (err) {
    return next(createHttpError(500, "Failed to update the category!!"));
  }
};
// get a category
const getAcategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.params.id);
  try {
    const category = await categoryModel.findById(req.params.id);
    res.json(category);
  } catch (err) {
    return next(createHttpError(401, "Failed to fetch a book"));
  }
};
const getAllcategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await categoryModel.find();
    res.json(categories);
  } catch (err) {
    return next(createHttpError(401, "Failed to find all the produts"));
  }
};

export {
  createCategory,
  updateAcategory,
  deleteAcategory,
  getAcategory,
  getAllcategory,
};
