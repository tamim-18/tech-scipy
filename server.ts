// creating a server

import express from "express";
import dotenv from "dotenv";
import { config } from "./config/config";
import connectDb from "./config/db";
import userRegistrationRouter from "./routes/userRegistrationRouter";

const app = express();
const port = config.port;

app.use(express.json()); // to parse json data

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

startServer();
