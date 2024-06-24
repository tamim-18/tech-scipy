// mongoose
import mongoose from "mongoose";
import { config } from "./config";

// connect to mongodb
const connectDb = async () => {
  try {
    // first we need to listen to the events that mongoose emits. We can do this by using the on() method.
    mongoose.connection.on("connected", () => {
      console.log("Connected to database");
    });
    //error event
    mongoose.connection.on("error", (err) => {
      console.error("Error connecting to database: ", err);
    });
    await mongoose.connect(config.dburl as string);
  } catch (err) {
    console.error("Error connecting to database: ", err);
    // exit the process if the connection fails
    process.exit(1);
  }

  // why as string? because the type of config.dburl is string | undefined. We are sure that it is a string, so we can use as string to tell TypeScript that it is a string.
};

export default connectDb;
