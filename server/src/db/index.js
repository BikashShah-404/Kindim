import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  const connectionInstance = await mongoose.connect(
    `${process.env.MONGODB_URL}${DB_NAME}`,
  );
  console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
};

export default connectDB;
