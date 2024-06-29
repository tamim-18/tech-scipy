// creating user registration controller

import { NextFunction, Request, Response } from "express";
import userModel from "../models/userModel";
import createHttpError from "http-errors";
import { userModelTypes } from "../types/userModelTypes";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

import { config } from "../config/config";
import { Auth } from "mongodb";
import { AuthRequest } from "../middlewares/authenticate";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  //if user already exists

  const { email, mobile, password, isAdmin } = req.body;
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
      isAdmin,
    });
  } catch (err) {
    return next(createHttpError(500, "Something went wrong"));
  }
  // token generation using jwt
  // jwt.sign({payload}, secret, {options})
  // options: expiresIn, algorithm, issuer, audience
  const token = sign(
    //@ts-ignore
    { id: newUser?._id },
    config.jwtSecret as string,
    {
      expiresIn: "7d",
    }
  );
  res.status(201).json({ accessToken: token });
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
    // console.log(user);
    if (!user) {
      return next(createHttpError(401, "Invalid credentials"));
    }
    //check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createHttpError(401, "Invalid credentials"));
    }

    //toker generation using jwt
    const token = sign({ sub: user._id }, config.jwtSecret as string, {
      expiresIn: "7d",
    });
    //send response
    res.status(200).json({ accessToken: token });
  } catch (err) {
    return next(createHttpError(404, "User not found"));
  }
};

//getting all users

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userModel.find({});
    res.status(200).json(users);
  } catch (err) {
    return next(createHttpError(500, "Something went wrong"));
  }
};

//get single user
const getSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    return next(createHttpError(500, "Something went wrong"));
  }
};

// delete a user
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    return next(createHttpError(500, "Something went wrong"));
  }
};

//update user
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const _req = req as AuthRequest; // Typecasting the request to AuthRequest. why req as AuthRequest? because we need to access the userId from the request.
  //console.log(_req.userId);
  try {
    const user = await userModel.findByIdAndUpdate(
      _req.userId,
      {
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      { new: true }
    );

    res.status(200).json(user);
  } catch (err) {
    return next(createHttpError(500, "Something went wrong"));
  }
};

// block user.. only admin can block user

const blockUser = async (req: Request, res: Response, next: NextFunction) => {
  const _req = req as AuthRequest; // Typecasting the request to AuthRequest. why req as AuthRequest? because we need to access the userId from the request.
  try {
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        isBlocked: true,
      },
      { new: true }
    );
    res.status(200).json(user);
  } catch (err) {
    return next(createHttpError(500, "Something went wrong"));
  }
};

// unblock user.. only admin can unblock user

const unblockUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        isBlocked: false,
      },
      { new: true }
    );
    res.status(200).json(user);
  } catch (err) {
    return next(createHttpError(500, "Something went wrong"));
  }
};

export {
  createUser,
  userLogin,
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
};
