//blog router
import express from "express";
import { authentication, isAdmin } from "../middlewares/authenticate";
import { createBlog, updateAblog } from "../controller/blogController";

const blogRouter = express.Router();

blogRouter.post("/", authentication, isAdmin, createBlog);
//update a blog
blogRouter.put("/:id", authentication, isAdmin, updateAblog);

export default blogRouter;
