// creating user registration router

import express from "express";
import {
  adminLogin,
  blockUser,
  createUser,
  deleteUser,
  forgetPasswordToken,
  getAllUsers,
  getSingleUser,
  getWhistList,
  logoutUser,
  refreshToken,
  resetPassword,
  unblockUser,
  updatePassword,
  updateUser,
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

//logout user
userRouter.get("/logout", logoutUser);

userRouter.get("/all-users", getAllUsers);
userRouter.get("/whistList", authentication, getWhistList);

//@ts-ignore
userRouter.get("/:id", authentication, isAdmin, getSingleUser);
userRouter.delete("/:id", deleteUser);
userRouter.put("/update-user", authentication, updateUser);
//get admin
//@ts-ignore
userRouter.get("/admin", authentication, isAdmin);

//block user
//@ts-ignore
userRouter.put("/block-user/:id", authentication, isAdmin, blockUser);
//unblock user
//@ts-ignore
userRouter.put("/unblock-user/:id", authentication, isAdmin, unblockUser);

// authenticating the refresh token

export default userRouter;
