import { NextFunction, Request, Response } from "express";

//create product
const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("create product");
};

export { createProduct };
