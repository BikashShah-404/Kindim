import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import app from "../app.js";
import connectDB from "../db/index.js";

let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  app(req, res);
}
