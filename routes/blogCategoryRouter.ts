import { Router } from "express";
import {
  createCategory,
  deleteAcategory,
  getAcategory,
  getAllcategory,
  updateAcategory,
} from "../controller/blogCategorycontroller";
import { authentication, isAdmin } from "../middlewares/authenticate";

const blogCategoryRouter = Router();

blogCategoryRouter.post("/", authentication, isAdmin, createCategory);
blogCategoryRouter.put("/:id", authentication, isAdmin, updateAcategory);
blogCategoryRouter.delete("/:id", authentication, isAdmin, deleteAcategory);
blogCategoryRouter.get("/", getAllcategory);
blogCategoryRouter.get("/:id", getAcategory);

export default blogCategoryRouter;
