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
};

// freezing

export const config = Object.freeze(_cofig);
