import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import productModel from "../models/productModel";

//create product
const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, slug, price, description, quantity } = req.body;
    if (!title || !slug || !price || !description || !quantity) {
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
    const allProducts = await productModel.find();
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

export { createProduct, getAllProducts, getAProduct };
