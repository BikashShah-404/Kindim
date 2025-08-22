import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, //tells the browser that cross-origin requests are allowed to include credentials(cookie,authorization header,etc)
  })
);

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes:
import indexRouter from "./routes/index.js";
app.use("/", indexRouter);

app.use((err, req, res, next) => {
  err.message = err ? err.toString() : "Something went wrong";
  res
    .status(500)
    .json({ status: "error", statusCode: 500, message: err.message });
});

export default app;
