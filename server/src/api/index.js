import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import serverless from "serverless-http";
import app from "../app.js";
import connectDB from "../db/index.js";

await connectDB(); // ← connect once at module level

export default serverless(app);
