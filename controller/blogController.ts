import createHttpError from "http-errors";
import blogModel from "../models/blogModel";
import userModel from "../models/userModel";
import e, { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authenticate";
import validateMongoDbId from "../utils/validateMongoDbId";

const createBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newBblog = await blogModel.create(req.body);
    res.json(newBblog);
  } catch (err) {
    return next(createHttpError(500, "Failed to create a blog"));
  }
};

//update a blog
const updateAblog = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const updatedBlog = await blogModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedBlog);
  } catch (err) {
    return next(createHttpError(500, "Failed to update the blog"));
  }
};
// get a blog

const getAblog = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const blog = await blogModel.findById(id);
    const updateViews = await blogModel.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );
    res.json(updateViews);
  } catch (err) {
    return next(createHttpError(500, "Failed to get the blog"));
  }
};
// delete a blog
const deleteAblog = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const blog = await blogModel.findByIdAndDelete(id);
    res.json(blog);
  } catch (err) {
    return next(createHttpError(500, "Failed to delete the blog"));
  }
};

// get all blogs
const getAllBlogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blogs = await blogModel.find();
    res.json(blogs);
  } catch (err) {
    return next(createHttpError(500, "Failed to get all blogs"));
  }
};
//like a blog
const likeBlog = async (req: Request, res: Response, next: NextFunction) => {
  //get the login user
  const _req = req as AuthRequest;
  console.log(_req.userId);
  // get the blog id
  const { blogId } = req.body;
  console.log(blogId);
  try {
    //find the blog
    const blog = await blogModel.findById(blogId);
    console.log(blog);
    const isLiked = blog?.isLiked;
    const alreadyDisliked = blog?.dislikes?.find(
      (dislike) => dislike.toString() === _req.userId
    ); //check if the user has already disliked the blog
    if (alreadyDisliked) {
      const updatedBlog = await blogModel.findByIdAndUpdate(blogId, {
        $pull: { dislikes: _req.userId }, //remove the user from the dislikes array
        isDisliked: false,
      });
    }
    if (isLiked) {
      const updatedBlog = await blogModel.findByIdAndUpdate(blogId, {
        $pull: { likes: _req.userId }, //remove the user from the likes array
        isLiked: false,
      });
    } else {
      const updatedBlog = await blogModel.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: _req.userId }, //add the user to the likes array
          isLiked: true,
        },
        { new: true }
      );
      res.json(updatedBlog);
    }
  } catch (err) {
    return next(createHttpError(500, "Failed to like the blog"));
  }
};

export {
  createBlog,
  updateAblog,
  getAblog,
  deleteAblog,
  getAllBlogs,
  likeBlog,
};
