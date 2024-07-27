import { Router } from "express";
import { createCoupon } from "../controller/couponController";
import { authentication, isAdmin } from "../middlewares/authenticate";

const couponRouter = Router();

// create coupon
couponRouter.post("/", authentication, isAdmin, createCoupon);

export default couponRouter;
