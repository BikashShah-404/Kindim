import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import app from "./app.js";
import connectDB from "./db/index.js";

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("App not able to connect with DB!");
      throw error;
    });
    app.listen(PORT, () => {
      console.log(`Kindim running at URL : http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`MongoDB connection Failed : ${err}`);
  });
