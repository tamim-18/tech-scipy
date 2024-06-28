import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

// creating the interface named Authrequest

export interface AuthRequest extends Request {
  userId: string; // extending the Request.
}

const authentication = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization"); // Get the token from the header
  if (!token) {
    return next(createHttpError(401, "Token is required"));
  }

  try {
    const parsedToken = token.split(" ")[1]; // This is because the token is in the format "Bearer token
    const decoded = jwt.verify(parsedToken, config.jwtSecret as string); // Verify the token
    const _req = req as AuthRequest; // Typecasting the request to AuthRequest
    _req.userId = decoded.sub as string;
  } catch (err) {
    return next(createHttpError(401, "Token is expired"));
  }
  // This will throw an error if the token is invalid.
  //   console.log(decoded);
  next(); // This is important. If you don't call next(), the request will hang.
};
export { authentication };
