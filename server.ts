// creating a server

import express from "express";
import dotenv from "dotenv";
import { config } from "./config/config";
import connectDb from "./config/db";

const app = express();
const port = config.port;

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
startServer();
