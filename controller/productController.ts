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

export { createProduct };
