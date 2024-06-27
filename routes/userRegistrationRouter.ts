// creating user registration router

import express from "express";
import {
  createUser,
  userLogin,
} from "../controller/userRegistrationController";

const userRouter = express.Router();

userRouter.post("/register", createUser);
userRouter.post("/login", userLogin);

export default userRouter;
