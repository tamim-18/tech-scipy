import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import productModel from "../models/productModel";
import slugify from "slugify";

//create product
const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, price, description, quantity } = req.body;
    if (title) {
      req.body.slug = slugify(title);
    }
    if (!title || !price || !description || !quantity) {
      return next(createHttpError(400, "All fields are required"));
    }
    const newProduct = await productModel.create(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    return next(createHttpError(500, "Something went wrong"));
  }
};
//get all products
const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allProducts = await productModel
      .where("category")
      .equals(req.query.category); //filtering products by category

    res.json(allProducts);
  } catch (err) {
    return next(createHttpError(401, "Falied to fetch all the products"));
  }
};
//get a single product

const getAProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const singleUser = await productModel.findById(req.params.id);
    res.json(singleUser);
  } catch (err) {
    return next(createHttpError(401, "Failed to fetch a single product"));
  }
};
// update a product

const updateAproduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (err) {
    return next(createHttpError(500, "Failed to update"));
  }
};

// delete a product
const deleteAproduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await productModel.findByIdAndDelete(req.params.id);
    res.json("User Deleted successfully");
  } catch (err) {
    return next(createHttpError(500, "Falied to delete"));
  }
};

export {
  createProduct,
  getAllProducts,
  getAProduct,
  updateAproduct,
  deleteAproduct,
};
