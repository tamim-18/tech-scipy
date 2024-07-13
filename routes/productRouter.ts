// creating product router

import express from "express";
import { Router } from "express";
import { authentication, isAdmin } from "../middlewares/authenticate";
import {
  createProduct,
  deleteAproduct,
  getAllProducts,
  getAProduct,
  updateAproduct,
} from "../controller/productController";

const productRouter: Router = Router();

//create product routes
productRouter.post("/", authentication, isAdmin, createProduct);
productRouter.get("/all-products", getAllProducts);
productRouter.get("/:id", getAProduct);
productRouter.put("/addtoWhistlist", authentication);
productRouter.put("/:id", authentication, isAdmin, updateAproduct);

productRouter.delete("/:id", authentication, isAdmin, deleteAproduct);

export default productRouter;
