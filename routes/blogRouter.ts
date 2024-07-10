//blog router
import express from "express";
import { authentication, isAdmin } from "../middlewares/authenticate";
import {
  createBlog,
  deleteAblog,
  getAblog,
  getAllBlogs,
  likeBlog,
  updateAblog,
} from "../controller/blogController";

const blogRouter = express.Router();

blogRouter.post("/", authentication, isAdmin, createBlog);

//update a blog
blogRouter.put("/:id", authentication, isAdmin, updateAblog);
blogRouter.put("/likes", authentication, likeBlog);
//get a blog
blogRouter.get("/:id", getAblog);
//delete a blog
blogRouter.delete("/:id", authentication, isAdmin, deleteAblog);
//get all blogs
blogRouter.get("/", getAllBlogs);
//like a blog

export default blogRouter;
