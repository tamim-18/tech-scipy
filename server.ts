// creating a server

import express from "express";
import dotenv from "dotenv";
import { config } from "./config/config";
import connectDb from "./config/db";
import userRegistrationRouter from "./routes/userRegistrationRouter";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";
import productRouter from "./routes/productRouter";
import morgan from "morgan";
import blogRouter from "./routes/blogRouter";

const app = express();
const port = config.port;

app.use(express.json()); // to parse json data
//cookie parser
app.use(cookieParser()); // to parse cookies. what is cookie parser? It is a middleware that parses cookies attached to the client request object. It makes cookies available in the request object as req.cookies.
app.use(morgan("dev"));
// starting
const startServer = async () => {
  await connectDb();
  const port = config.port || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

// server site

app.get("/", (req, res) => {
  res.send("Hello World");
});

//user registration
app.use("/api/user", userRegistrationRouter);

// all product routes
app.use("/api/product", productRouter);
//all blog routes
app.use("/api/blog", blogRouter);

//handling error
app.use(globalErrorHandler);

startServer();
