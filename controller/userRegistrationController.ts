// creating user registration controller

import { Request, Response } from "express";
import userModel from "../models/userModel";

const createUser = async (req: Request, res: Response) => {
  //if user already exists

  const { email, mobile } = req.body;

  try {
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    //user don't have uniwue phone number
    const mobileExists = await userModel.findOne({ mobile });
    if (mobileExists) {
      return res.status(400).json({ message: "Mobile number already exists" });
    }

    //create user
    const user = await userModel.create(req.body);
    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export { createUser };
