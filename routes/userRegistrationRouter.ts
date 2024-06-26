// creating user registration router

import express from "express";
import { createUser } from "../controller/userRegistrationController";

const userRouter = express.Router();

userRouter.post("/register", createUser);

export default userRouter;
