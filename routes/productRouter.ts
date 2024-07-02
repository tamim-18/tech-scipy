// creating product router

import express from "express";
import { Router } from "express";
import { createProduct } from "../controller/productController";

const productRouter: Router = Router();

//create product routes
productRouter.post("/", createProduct);

export default productRouter;
