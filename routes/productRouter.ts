// creating product router

import express from "express";
import { Router } from "express";
import { authentication, isAdmin } from "../middlewares/authenticate";
import {
  createProduct,
  getAllProducts,
  getAProduct,
  updateAproduct,
} from "../controller/productController";

const productRouter: Router = Router();

//create product routes
productRouter.post("/", createProduct);
productRouter.get("/all-products", getAllProducts);
productRouter.get("/:id", getAProduct);
productRouter.put("/:id", authentication, isAdmin, updateAproduct);

export default productRouter;
