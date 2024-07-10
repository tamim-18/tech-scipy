import { Router } from "express";
import { createCategory } from "../controller/categoryController";

const categoryRouter = Router();

export default categoryRouter;

categoryRouter.post("/", createCategory);
