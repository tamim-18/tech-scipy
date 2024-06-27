// creating user registration controller

import { NextFunction, Request, Response } from "express";
import userModel from "../models/userModel";
import createHttpError from "http-errors";
import { userModelTypes } from "../types/userModelTypes";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

import { config } from "../config/config";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  //if user already exists

  const { email, mobile, password } = req.body;
  try {
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return next(createHttpError(400, "Email already exists"));
    }

    //user don't have uniwue phone number
    const mobileExists = await userModel.findOne({ mobile });
    if (mobileExists) {
      return next(createHttpError(400, "Mobile number already exists"));
    }

    //create user
  } catch (err) {
    return next(createHttpError(500, "Something went wrong"));
  }
  //hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  let newUser: userModelTypes;
  //save user
  try {
    newUser = await userModel.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email,
      mobile,
      password: hashedPassword,
    });
  } catch (err) {
    return next(createHttpError(500, "Something went wrong"));
  }
  //send response
  res.status(201).json({
    message: "User created successfully",
    data: {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      mobile: newUser.mobile,
      password: newUser.password,
    },
  });
};

// user login

const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  //validate user
  if (!email || !password) {
    return next(createHttpError(400, "Please provide email and password"));
  }
  //check if user exists
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return next(createHttpError(401, "Invalid credentials"));
    }
    //check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return next(createHttpError(401, "Invalid credentials"));
    }
    //toker generation using jwt
    const token = sign({ sub: user._id }, config.jwtSecret as string, {
      expiresIn: "7d",
    });
    //send response
    res.status(201).json({ accessToken: token });
  } catch (err) {
    return next(createHttpError(404, "User not found"));
  }
  res.status(201).json({ message: "User logged in successfully" });
};

export { createUser, userLogin };
