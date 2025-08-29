import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies.accessToken ||
    req.header("Authorization")?.replace("Bearer", "");

  if (!token) throw new Error("Unauthorized Request");

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(decodedToken._id).select(
    "-password -refreshToken "
  );

  if (!user) throw new Error("Invalid Access Token");

  req.user = user;
  next();
});

export const authorizedAdmin = asyncHandler(async (req, res, next) => {
  const { user } = req;
  if (!user) throw new Error("User not found");
  if (!user.isAdmin) throw new Error("Admin Access Denied...");
  next();
});
