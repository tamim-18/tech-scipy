// creating user registration router

import express, { application } from "express";
import {
  adminLogin,
  applyCouponToUserCart,
  blockUser,
  createOrder,
  createUser,
  deleteUser,
  emptyCart,
  forgetPasswordToken,
  getAllUsers,
  getOrders,
  getSingleUser,
  getUserCart,
  getWhistList,
  logoutUser,
  refreshToken,
  resetPassword,
  saveAddres,
  unblockUser,
  updateOrderStatus,
  updatePassword,
  updateUser,
  userCart,
  userLogin,
} from "../controller/userRegistrationController";
import { authentication, isAdmin } from "../middlewares/authenticate";

const userRouter = express.Router();

userRouter.post("/register", createUser);
userRouter.post("/login", userLogin);
//admin login
userRouter.post("/admin-login", adminLogin);
userRouter.get("/refresh-token", refreshToken);
//change password
userRouter.put("/change-password", authentication, updatePassword);
userRouter.post("/forgetPassword-token", forgetPasswordToken);
userRouter.put("/reset-password/:resetToken", resetPassword);
userRouter.put("/save-address", authentication, saveAddres);
//logout user
userRouter.get("/logout", logoutUser);

userRouter.get("/all-users", getAllUsers);
userRouter.get("/whistList", authentication, getWhistList);
userRouter.get("/get-orders", authentication, getOrders);
userRouter.get("/cart", authentication, getUserCart);
//@ts-ignore
userRouter.get("/:id", authentication, isAdmin, getSingleUser);
userRouter.delete("/empty-cart", authentication, emptyCart);
userRouter.delete("/:id", deleteUser);

userRouter.put("/update-user", authentication, updateUser);
//get admin
//@ts-ignore
userRouter.get("/admin", authentication, isAdmin);

//block user
//@ts-ignore
userRouter.put("/block-user/:id", authentication, isAdmin, blockUser);
userRouter.put("/update-order/:id", authentication, isAdmin, updateOrderStatus);
//unblock user
//@ts-ignore
userRouter.put("/unblock-user/:id", authentication, isAdmin, unblockUser);
userRouter.put("/add-to-cart", authentication, userCart);
// authenticating the refresh token

// delete cart

//buggy empty-cart

// apply coupon
userRouter.post("/cart/appy-coupon", authentication, applyCouponToUserCart);
//create orderd
userRouter.post("/cart/cash-order", authentication, createOrder);

export default userRouter;
