// creating user registration router

import express from "express";
import {
  createUser,
  getAllUsers,
  getSingleUser,
  userLogin,
} from "../controller/userRegistrationController";

const userRouter = express.Router();

userRouter.post("/register", createUser);
userRouter.post("/login", userLogin);
userRouter.get("/all-users", getAllUsers);
userRouter.get("/:id", getSingleUser);

export default userRouter;
