import { Router } from "express";
import {
  createBrand,
  deleteAbrand,
  getAbrand,
  getAllbrand,
  updateAbrand,
} from "../controller/brandController";
import { authentication, isAdmin } from "../middlewares/authenticate";

const brandRouter = Router();

brandRouter.post("/", authentication, isAdmin, createBrand);
brandRouter.put("/:id", authentication, isAdmin, updateAbrand);
brandRouter.delete("/:id", authentication, isAdmin, deleteAbrand);
brandRouter.get("/", getAllbrand);
brandRouter.get("/:id", getAbrand);

export default brandRouter;
