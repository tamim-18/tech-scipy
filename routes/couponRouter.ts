import { Router } from "express";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  updateACoupon,
} from "../controller/couponController";
import { authentication, isAdmin } from "../middlewares/authenticate";

const couponRouter = Router();

// create coupon
couponRouter
  .post("/", authentication, isAdmin, createCoupon)
  .get("/", authentication, getAllCoupons)
  .put("/:id", authentication, isAdmin, updateACoupon)
  .delete("/:id", authentication, isAdmin, deleteCoupon);

export default couponRouter;
