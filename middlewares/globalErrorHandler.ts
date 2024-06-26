import { HttpError } from "http-errors";
import { config } from "../config/config";
import { NextFunction, Request, Response } from "express";

const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    message,
    errorStack: config.env === "production" ? "🤫" : err.stack,
    // why do we need to check the environment?
    // because we don't want to expose the error stack to the user in production
  });
};

export default globalErrorHandler;
