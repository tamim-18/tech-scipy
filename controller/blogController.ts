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
    const blog = await blogModel.findById(id).populate("likes"); //poulate method is used to get the user details who liked the blog
    const updateViews = await blogModel.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );
    res.json(blog);
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
  // Get the logged-in user
  const _req = req as AuthRequest;

  // Get the blog ID
  const { blogId } = req.body;

  try {
    // Find the blog
    const blog = await blogModel.findById(blogId);

    // Check if the user has already disliked the blog
    const alreadyDisliked = blog?.dislikes?.find(
      (dislike) => dislike.toString() === _req.userId
    );

    if (alreadyDisliked) {
      await blogModel.findByIdAndUpdate(blogId, {
        $pull: { dislikes: _req.userId }, // Remove the user from the dislikes array
        isDisliked: false,
      });
    }

    // Check if the user has already liked the blog
    const isLiked = blog?.isLiked;
    let updatedBlog: any;

    if (isLiked) {
      updatedBlog = await blogModel.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: _req.userId }, // Remove the user from the likes array
          isLiked: false,
        },
        { new: true }
      );
    } else {
      updatedBlog = await blogModel.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: _req.userId }, // Add the user to the likes array
          isLiked: true,
        },
        { new: true }
      );
    }

    res.json(updatedBlog);
  } catch (err) {
    return next(createHttpError(500, "Failed to like the blog"));
  }
};
//dislike a blog
const dislikedBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const _req = req as AuthRequest;
  const { blogId } = req.body;

  try {
    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return next(createHttpError(404, "Blog not found"));
    }

    const alreadyLiked = blog.likes?.some(
      (like) => like.toString() === _req.userId
    );
    const isDisliked = blog.isDisliked;
    let updatedBlog: any;

    // If the user already liked the blog, remove the like
    if (alreadyLiked) {
      updatedBlog = await blogModel.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: _req.userId },
          isLiked: false,
        },
        { new: true }
      );
    }

    // If the blog is already disliked, remove the dislike
    if (isDisliked) {
      updatedBlog = await blogModel.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: _req.userId },
          isDisliked: false,
        },
        { new: true }
      );
    } else {
      // Otherwise, add the dislike
      updatedBlog = await blogModel.findByIdAndUpdate(
        blogId,
        {
          $push: { dislikes: _req.userId },
          isDisliked: true,
        },
        { new: true }
      );
    }

    res.json(updatedBlog);
  } catch (err) {
    next(createHttpError(500, "Failed to dislike the blog"));
  }
};

export {
  createBlog,
  updateAblog,
  getAblog,
  deleteAblog,
  getAllBlogs,
  likeBlog,
  dislikedBlog,
};
