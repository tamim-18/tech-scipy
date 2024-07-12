import { Router } from "express";
import {
  createCategory,
  deleteAcategory,
  getAcategory,
  getAllcategory,
  updateAcategory,
} from "../controller/categoryController";
import { authentication, isAdmin } from "../middlewares/authenticate";

const categoryRouter = Router();

categoryRouter.post("/", authentication, isAdmin, createCategory);
categoryRouter.put("/:id", authentication, isAdmin, updateAcategory);
categoryRouter.delete("/:id", authentication, isAdmin, deleteAcategory);
categoryRouter.get("/", getAllcategory);
categoryRouter.get("/:id", getAcategory);

export default categoryRouter;
