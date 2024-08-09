// creating product router

import express from "express";
import { Router } from "express";
import { authentication, isAdmin } from "../middlewares/authenticate";
import {
  addToWhistList,
  createProduct,
  deleteAproduct,
  getAllProducts,
  getAProduct,
  rating,
  updateAproduct,
  uploadPhotos,
} from "../controller/productController";
import multer from "multer";
import path from "node:path/posix";
import { uploadPhoto } from "../middlewares/upload";
const productRouter: Router = Router();
const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 3e7 },
});
//create product routes
productRouter.post("/", authentication, isAdmin, createProduct);
productRouter.get("/all-products", getAllProducts);
productRouter.get("/:id", getAProduct);
productRouter.put("/addtoWhistlist", authentication, addToWhistList);
productRouter.put(
  "/upload/:id",
  authentication,
  isAdmin,
  upload.array("images", 10),
  uploadPhotos
);
productRouter.put("/rating", authentication, rating);
productRouter.put("/:id", authentication, isAdmin, updateAproduct);

productRouter.delete("/:id", authentication, isAdmin, deleteAproduct);
// router

export default productRouter;
