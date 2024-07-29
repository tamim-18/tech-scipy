import { config as dotenv } from "dotenv";
import { env } from "process";

dotenv(); // loading the environment variables

const _cofig = {
  port: env.PORT || 3000,
  dburl: env.MONGO_URI,
  env: env.NODE_ENV,
  jwtSecret: env.JWT_SECRET_KEY,
  email: env.EMAIL,
  password: env.PASSWORD,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

// freezing

export const config = Object.freeze(_cofig);
