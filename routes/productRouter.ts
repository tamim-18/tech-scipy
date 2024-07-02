// creating product router

import express from "express";
import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getAProduct,
} from "../controller/productController";

const productRouter: Router = Router();

//create product routes
productRouter.post("/", createProduct);
productRouter.get("/all-products", getAllProducts);
productRouter.get("/:id", getAProduct);

export default productRouter;
