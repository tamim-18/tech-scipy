import { Request, Response, NextFunction } from "express";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import createHttpError from "http-errors";
import productModel from "../models/productModel";
import { AuthRequest } from "../middlewares/authenticate";
import slugify from "slugify";
import userModel from "../models/userModel";

interface PaginationQuery {
  page?: string;
  limit?: string;
}

//create product
const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, price, description, quantity } = req.body;
    if (title) {
      req.body.slug = slugify(title);
    }
    if (!title || !price || !description || !quantity) {
      return next(createHttpError(400, "All fields are required"));
    }
    const newProduct = await productModel.create(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    return next(createHttpError(500, "Something went wrong"));
  }
};
//get all products
const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const queryObj = { ...req.query }; //query object
    //advance filtering...
    const excludedFields = ["page", "sort", "limit", "fields"]; //fields to exclude
    excludedFields.forEach((el) => delete queryObj[el]); //delete the fields from the query object
    let queryStr = JSON.stringify(queryObj); //convert the query object to string
    console.log(queryStr);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); //replace the query object with the query string
    // console.log(queryStr);
    // console.log(JSON.parse(queryStr));
    // get all products

    // const allProducts = await productModel.find(JSON.parse(queryStr));

    const query = productModel.find(JSON.parse(queryStr));

    // const allProducts = await productModel.find(queryObj);
    //filtering products by category

    //sorting products
    const sort = req.query.sort;
    if (sort) {
      //@ts-ignore
      const sortBy = sort.split(",").join(" ");
      console.log(sortBy);
      query.sort(sortBy);
    } else {
      query.sort("-createdAt");
    }

    const { page = "1", limit = "100" } = req.query as PaginationQuery;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;
    console.log(skip, limitNumber);
    query.skip(skip).limit(limitNumber); //skip and limit the products
    //validate the page number
    if (req.query.page) {
      const totalProducts = await productModel.countDocuments();
      if (skip >= totalProducts) {
        return next(createHttpError(400, "This page does not exist"));
      }
    }

    //fields limiting
    if (req.query.fields) {
      //@ts-ignore
      const fields = req.query.fields.split(",").join(" ");
      query.select(fields);
    } else {
      query.select("-__v"); //exclude the version field
    }
    const allProducts = await query;
    res.json(allProducts);
  } catch (err) {
    return next(createHttpError(401, "Falied to fetch all the products"));
  }
};
//get a single product

const getAProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const singleUser = await productModel.findById(req.params.id);
    res.json(singleUser);
  } catch (err) {
    return next(createHttpError(401, "Failed to fetch a single product"));
  }
};
// update a product

const updateAproduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (err) {
    return next(createHttpError(500, "Failed to update"));
  }
};

// delete a product
const deleteAproduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await productModel.findByIdAndDelete(req.params.id);
    res.json("User Deleted successfully");
  } catch (err) {
    return next(createHttpError(500, "Falied to delete"));
  }
};
// addtowhistList

const addToWhistList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const _req = req as AuthRequest;
  const { prodId } = req.body;

  try {
    // getting the user
    const user = await userModel.findById(_req.userId);
    const allreadyAdded = user?.whistlist?.find((e) => e.toString() === prodId);
    let updatedUser: any;
    if (allreadyAdded) {
      updatedUser = await userModel.findByIdAndUpdate(
        _req.userId,
        {
          $pull: { whistlist: prodId },
        },
        { new: true }
      );
    } else {
      updatedUser = await userModel.findByIdAndUpdate(
        _req.userId,
        {
          $push: { whistlist: prodId },
        },
        { new: true }
      );
    }
    console.log(updatedUser);
    res.json(updatedUser);
  } catch (err) {
    return next(createHttpError(404, "Failed to add wishList 😭"));
  }
};

const rating = async (req: Request, res: Response, next: NextFunction) => {
  const _req = req as AuthRequest;
  const { star, prodId, comment } = req.body;
  console.log(comment);

  try {
    const product = await productModel.findById(prodId);
    if (!product) {
      return next(createHttpError(404, "Product not found"));
    }

    const alreadyRated = product?.ratings?.find(
      (el) => el.postedby.toString() === _req.userId
    );

    let rateProduct: any;
    if (alreadyRated) {
      await productModel.updateOne(
        {
          _id: prodId,
          //@ts-ignore
          "ratings._id": alreadyRated._id,
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        }
      );
      rateProduct = await productModel.findById(prodId); // Retrieve updated product
    } else {
      rateProduct = await productModel.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _req.userId,
            },
          },
        },
        { new: true }
      );
    }
    const totalRating = rateProduct.ratings.length;
    let ratingSum = 0;
    const totalRatingSum = rateProduct?.ratings?.reduce(
      (sum: any, rating: any) => sum + rating.star,
      0
    );
    const avgRating = Math.round(totalRatingSum / totalRating);
    rateProduct = await productModel.findByIdAndUpdate(
      prodId,
      {
        totalrating: avgRating,
      },
      {
        new: true,
      }
    );
    res.json(rateProduct);
  } catch (err) {
    return next(createHttpError(500, "Failed to fetch the product ratings"));
  }
};

// create upload photo

const uploadPhotos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const files = req.files as Express.Multer.File[];

  try {
    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const outputPath = path.join(
          __dirname,
          "../../public/data/uploads/resized",
          file.filename
        );
        await sharp(file.path)
          .resize(300, 300)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(outputPath);

        const result = await cloudinary.uploader.upload(outputPath, {
          folder: "product-images",
        });

        fs.unlinkSync(file.path); // Delete the original file
        fs.unlinkSync(outputPath); // Delete the resized file

        return { public_id: result.public_id, url: result.secure_url };
      })
    );

    const product = await productModel.findById(id);
    if (!product) {
      return next(createHttpError(404, "Product not found"));
    }

    product.images = product.images
      ? [...product.images, ...uploadResults]
      : uploadResults;
    await product.save();

    res.status(200).json({ images: product.images });
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, "Error while uploading files"));
  }
};

export {
  createProduct,
  getAllProducts,
  getAProduct,
  updateAproduct,
  deleteAproduct,
  addToWhistList,
  rating,
  uploadPhotos,
};
