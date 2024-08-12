//blog router
import express from "express";
import { authentication, isAdmin } from "../middlewares/authenticate";
import {
  createBlog,
  deleteAblog,
  dislikedBlog,
  getAblog,
  getAllBlogs,
  likeBlog,
  updateAblog,
  uploadBlogPhotos,
} from "../controller/blogController";
import multer from "multer";
import path from "path";

const blogRouter = express.Router();
const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"), //destination of the uploaded file
  limits: { fileSize: 3e7 },
});

blogRouter.post("/", authentication, isAdmin, createBlog);
blogRouter.put("/likes", authentication, likeBlog);
blogRouter.put("/dislikes", authentication, dislikedBlog);
//update a blog
blogRouter.put("/:id", authentication, isAdmin, updateAblog);

// upload image
blogRouter.put(
  "/upload/:id",
  authentication,
  isAdmin,
  upload.array("images", 10),
  uploadBlogPhotos
);
//get a blog
blogRouter.get("/:id", getAblog);
//delete a blog
blogRouter.delete("/:id", authentication, isAdmin, deleteAblog);
//get all blogs
blogRouter.get("/", getAllBlogs);
//like a blog

export default blogRouter;
