// creating user registration router

import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  userLogin,
} from "../controller/userRegistrationController";
import { authentication, isAdmin } from "../middlewares/authenticate";

const userRouter = express.Router();

userRouter.post("/register", createUser);
userRouter.post("/login", userLogin);
userRouter.get("/all-users", getAllUsers);
//@ts-ignore
userRouter.get("/:id", authentication, isAdmin, getSingleUser);
userRouter.delete("/:id", deleteUser);
userRouter.put("/:id", updateUser);

export default userRouter;
