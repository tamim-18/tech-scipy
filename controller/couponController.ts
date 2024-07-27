//creating coupon

import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import couponModel from "../models/couponModel";

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

export { createCoupon };
