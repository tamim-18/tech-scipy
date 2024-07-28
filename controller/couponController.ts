//creating coupon

import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import couponModel from "../models/couponModel";
import productModel from "../models/productModel";

const createCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const create = await couponModel.create(req.body);
    res.json({
      data: {
        create,
      },
    });
  } catch (err) {
    return next(createHttpError(500, "Falied to create a coupon"));
  }
};

const getAllCoupons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const coupons = await couponModel.find();
    res.json(coupons);
  } catch (err) {
    return next(createHttpError(500, "Falied to create coupon"));
  }
};

const updateACoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const updatedCoupon = await couponModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedCoupon);
  } catch (err) {
    return next(createHttpError(401, "Can not be updated!"));
  }
};
const deleteCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const deletedCoupon = await couponModel.findByIdAndDelete(id);
    if (!deletedCoupon) return next(createHttpError(404, "Not found"));
    res.json(deletedCoupon);
  } catch (err) {
    return next(createHttpError(401, "Not found!"));
  }
};

export { createCoupon, getAllCoupons, updateACoupon, deleteCoupon };
