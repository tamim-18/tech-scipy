import { env } from "process";
// creating user registration controller

import { NextFunction, Request, Response } from "express";
import userModel from "../models/userModel";
import createHttpError from "http-errors";
import { userModelTypes } from "../types/userModelTypes";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import jwt from "jsonwebtoken";

import { config } from "../config/config";
import { AuthRequest } from "../middlewares/authenticate";
import crypto from "crypto";
import { sendMail } from "../middlewares/mailControl";

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

    //creating a cookie
    const refreshToken = sign({ sub: user._id }, config.jwtSecret as string, {
      expiresIn: "3d",
    });
    // update refresh token in db
    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      {
        refreshToken: refreshToken,
        // return updated user
      },
      { new: true }
    );
    //refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ accessToken: token });
  } catch (err) {
    return next(createHttpError(404, "User not found"));
  }
};

//handle refresh token.. why? because we need to refresh the token after it expires
const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken; //get refresh token from cookie
    if (!refreshToken) {
      return next(createHttpError(401, "Unauthorized")); // If refresh token not found
    }

    const user = await userModel.findOne({ refreshToken });
    if (!user) {
      return next(createHttpError(401, "Unauthorized"));
    }
    //verify the token. beacuse we need to check if the token is valid or not. if not valid then we need to send unauthorized
    jwt.verify(
      refreshToken,
      config.jwtSecret as string,
      (err: jwt.VerifyErrors | null, decoded: any) => {
        if (err || !decoded || user._id.toString() !== decoded.sub) {
          return next(createHttpError(401, "Unauthorized"));
        }

        const token = jwt.sign({ sub: user._id }, config.jwtSecret as string, {
          expiresIn: "7d",
        });
        res.status(200).json({ accessToken: token });
      }
    );
  } catch (err) {
    return next(createHttpError(500, "Something went wrong"));
  }
};

//logout user

const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return next(createHttpError(401, "Unauthorized"));
    }
    //get user
    const user = await userModel.findOne({ refreshToken });
    if (!user) {
      //clear cookie
      res.clearCookie("refreshToken", {
        httpOnly: true, //cookie cannot be accessed by javascript
        secure: true, //only works on https
      });
      return next(createHttpError(401, "Unauthorized")); //if user not found
    }
    //update refresh token in db
    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      {
        refreshToken: "",
      },
      { new: true }
    );
    //clear cookie
    res.clearCookie("refreshToken", {
      httpOnly: true, //cookie cannot be accessed by javascript
      secure: true, //only works on https
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    return next(createHttpError(500, "Something went wrong"));
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
//update password
const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resetToken = crypto.randomBytes(32).toString("hex"); //generate random token
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex"); //hash the token
    const passwordResetExpires = Date.now() + 10 * 60 * 1000;
    //update password reset token and password reset expires
    //from AuthRequest we can access the userId
    const _req = req as AuthRequest;
    //upadte the password by checking
    const { currentPassword, password } = req.body;
    //check if the current password is correct
    const user = await userModel.findById(_req.userId);
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    console.log(password);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    console.log(isMatch);
    if (!isMatch) {
      return next(createHttpError(401, "Please enter correct password"));
    }
    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await userModel.findByIdAndUpdate(
      _req.userId,
      {
        password: hashedPassword,
        passwordResetToken: passwordResetToken,
        passwordResetExpires: passwordResetExpires,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    return next(createHttpError(500, "Something went wrong"));
  }
};

const forgetPasswordToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const passwordResetExpires = Date.now() + 10 * 60 * 1000;

    await userModel.findOneAndUpdate(
      { email },
      {
        passwordResetToken: passwordResetToken,
        passwordResetExpires: passwordResetExpires,
      },
      { new: true }
    );

    const resetUrl = `Hi, please follow the link to reset your password. This link will expire in 10 minutes.<a href='http://localhost:5000/api/user/reset-password/${resetToken}'>Click Here</a>`;
    const data = {
      subject: "Password Reset",
      text: "Password Reset",
      to: email,
      hmtl: resetUrl,
    };
    //@ts-ignore
    await sendMail(data);
    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (err) {
    next(createHttpError(500, "Something went wrong"));
  }
};
// reset password
const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password } = req.body;
    const { resetToken } = req.params;
    //hash the token
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    //check if the token is valid

    const user = await userModel.findOne({
      passwordResetToken: passwordResetToken,
      passwordResetExpires: { $gt: Date.now() }, //check if the token is not expired
    });
    if (!user) {
      return next(createHttpError(400, "Token is invalid or expired"));
    }
    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    //update the password
    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      {
        password: hashedPassword,
        passwordResetToken: "",
        passwordResetExpires: "",
      },
      { new: true }
    );
    res.status(200).json({ message: "Password updated successfully" });
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
  refreshToken,
  logoutUser,
  updatePassword,
  forgetPasswordToken,
  resetPassword,
};
