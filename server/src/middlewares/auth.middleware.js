import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies.accessToken ||
    req.header("Authorization")?.replace("Bearer", "");

  if (!token) throw new Error("Unauthorized Request");

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(decodedToken._id).select(
    "-password -refreshToken -forgetPasswordToken -forgetPasswordTokenExpires"
  );

  if (!user) throw new Error("Invalid Access Token");

  req.user = user;
  next();
});

export const authorizedAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user || !req.user.isAdmin) throw new Error("Forbidden : Admin Only");
  next();
});
