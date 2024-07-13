import { Request, Response, NextFunction } from "express";
import createHttpError, { HttpError } from "http-errors";
import brandModel from "../models/brandModel";

//creating newcategory
const createBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title } = req.body; //why name is used here? It is used to get the name of the category from the request body.
    //validating the category is already exist or not
    const brand = await brandModel.findOne({ title });
    if (brand) {
      return next(createHttpError(400, "Brand already exist"));
    }
    const newBrand = await brandModel.create(req.body);
    res.json(newBrand);
  } catch (err) {
    return next(createHttpError(500, "Failed to create a brand"));
  }
};
// update a category
const updateAbrand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  console.log(id);

  try {
    const updatedBrand = await brandModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedBrand) {
      return next(createHttpError(404, "Category not found"));
    }
    res.json(updatedBrand);
  } catch (err) {
    return next(createHttpError(500, "Failed to update the brand!!"));
  }
};
//delete a category
const deleteAbrand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  console.log(id);

  try {
    const deletedBrand = await brandModel.findByIdAndDelete(id);
    if (!deletedBrand) {
      return next(createHttpError(404, "Brand not found"));
    }
    res.json(deletedBrand);
  } catch (err) {
    return next(createHttpError(500, "Failed to update the brand!!"));
  }
};
// get a category
const getAbrand = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.params.id);
  try {
    const brand = await brandModel.findById(req.params.id);
    res.json(brand);
  } catch (err) {
    return next(createHttpError(401, "Failed to fetch a brand"));
  }
};
const getAllbrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const brands = await brandModel.find();
    res.json(brands);
  } catch (err) {
    return next(createHttpError(401, "Failed to find all the brands"));
  }
};

export { createBrand, updateAbrand, deleteAbrand, getAbrand, getAllbrand };
