import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import userModel from "../models/userModel";

// creating the interface named Authrequest

export interface AuthRequest extends Request {
  userId: string; // extending the Request.
}

const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization"); // Get the token from the header
  if (!token) {
    return next(createHttpError(401, "Token is required"));
  }

  try {
    const parsedToken = token.split(" ")[1]; // This is because the token is in the format "Bearer token
    const decoded = jwt.verify(parsedToken, config.jwtSecret as string); // Verify the token
    // console.log(decoded.sub);
    const _req = req as AuthRequest; // Typecasting the request to AuthRequest
    _req.userId = decoded.sub as string; // Set the userId in the request
  } catch (err) {
    return next(createHttpError(401, "Token is expired"));
  }
  // This will throw an error if the token is invalid.
  //   console.log(decoded);
  next(); // This is important. If you don't call next(), the request will hang.
};
const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const _req = req as AuthRequest;
    //console.log(_req.userId);
    const user = await userModel.findById(_req.userId);
    //console.log(user);
    //console.log(user?.isAdmin);
    if (user?.isAdmin) {
      return next(); // If the user is an admin, call the next middleware
    } else {
      return next(createHttpError(401, "Unauthorized"));
    }
  } catch (err) {
    return next(createHttpError(401, "Unauthorized"));
  }

  next();
};
export { authentication, isAdmin };
